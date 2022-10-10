import { Component, OnInit } from '@angular/core';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import { CreateAssignmentDialogComponent } from '../create-assignment-dialog/create-assignment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RouteConstant, ViewType } from '@sharedModule/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentModel } from '../../models';
import { AssignmentDetailModel, Classes } from '@sharedModule/models';
import { AssignmentListService, AssignmentViewService } from '../../services';
import { catchError, debounceTime, startWith, switchMap } from 'rxjs/operators';
import { getQueryParams } from '@sharedModule/functions';
import { merge, throwError } from 'rxjs';
import { SharedService } from '@sharedModule/services';
import { UserConfigModel } from 'edusense-users/src/app/public-modules/models';

@Component({
    selector: 'es-user-assignment-list',
    templateUrl: './assignment-list.component.html',
    styleUrls: ['./assignment-list.component.scss']
})
export class AssignmentListComponent extends FormBaseComponent
    implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Data;

    // Form group variables
    searchAssignmentTitle = new FormControl();
    assignmentSearchForm: FormGroup;

    // Data variables
    classList: Classes[] = [];
    classSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'classFilterField',
        filterControlName: 'classFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search session',
        selectPlaceholderLabel: 'Select session',
        isRequired: false,
        selectMulti: true,
        selectedValueCompairId: 'class_id',
        validationMsg: ''
    };
    assignmentList: AssignmentModel[] = [];
    userConfigDetails: UserConfigModel;

    // State Variables
    isLoadingResults = true;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private assignmentViewService: AssignmentViewService,
        private assignmentListService: AssignmentListService,
        private sharedService: SharedService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    // Initialisation methods
    initialize = () => {
        this.userConfigDetails = this.sharedService.getUserConfig();
        this.createAssignmentSearchForm();
        this.routeSubscriber();
        this.getAssignmentListBasedOnSearch();
    };

    createAssignmentSearchForm = () => {
        this.assignmentSearchForm = this.createForm({
            classFilterField: ['']
        });
    };

    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.classList) {
                this.classList = resolvedData.classList;
            }
        });
    };

    getAssignmentListBasedOnSearch = () => {
        this.isLoadingResults = true;
        merge(
            this.searchAssignmentTitle.valueChanges,
            this.formControls['classFilterField'].valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.getAssignmentListApiCall();
                }),
                catchError((error) => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe((response) => {
                this.assignmentListResponse(response);
            });
    };

    assignmentListResponse = (response) => {
        this.assignmentList = response['payload'];
        this.isLoadingResults = false;
        this.currentViewType = this.assignmentList.length
            ? this.viewType.Data
            : this.viewType.NoData;
    };

    // Api calls
    getAssignmentListApiCall = () => {
        this.currentViewType = this.viewType.Loading;
        return this.assignmentListService.getAssignmentList(this.queryParams());
    };

    getAssignmentDetailApiCall = (id: number) => {
        return this.assignmentViewService.getAssignmentDetails(id);
    };

    // Page events
    onSelectChangeEvent = (event, type) => {
        this.formControls[type].setValue(event);
    };

    getAssignmentDetail = (id: number) => {
        this.getAssignmentDetailApiCall(id).subscribe((response) => {
            this.onEditAssignment(response['payload']['data']);
        });
    };

    onCreateAssignment() {
        const dialogRef = this.dialog.open(CreateAssignmentDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: { classList: this.classList }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.searchAssignmentTitle.setValue('');
            }
        });
    }

    onEditAssignment(assignment: AssignmentDetailModel) {
        const dialogRef = this.dialog.open(CreateAssignmentDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: { classList: this.classList, assignment }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.searchAssignmentTitle.setValue('');
            }
        });
    }

    onAssignmentView(id: number) {
        this.router.navigate(['/' + RouteConstant.ASSIGNMENT_VIEW, id]);
    }

    // Helper methods
    queryParams = () => {
        let params = {};
        if (this.searchAssignmentTitle.value) {
            params['title'] = this.searchAssignmentTitle.value;
        }
        if (
            this.formControls['classFilterField'].value &&
            this.formControls['classFilterField'].value.length > 0
        ) {
            params['classId'] = this.formControls['classFilterField'].value.map(
                (e) => e.class_id
            );
        }
        return getQueryParams(params, null, null, null, true);
    };

    // Helpers
    get formControls() {
        return this.assignmentSearchForm.controls;
    }

    showMoreOptions = (assignment: AssignmentModel) => {
        let currentDate = new Date().setHours(0, 0, 0, 0);
        let sDate = new Date(assignment.start_date).setHours(0, 0, 0, 0);
        return (
            sDate > currentDate &&
            this.userConfigDetails.user_id === assignment.createdBy.user_id
        );
    };
}
