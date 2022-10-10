import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
    RouteConstant,
    PAGE_SIZE_OPTIONS,
    ViewType
} from '@sharedModule/constants';
import { FormControl } from '@angular/forms';
import { ClassStudentsModel } from 'edusense-users/src/app/private-modules/models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationMessageDialogComponent } from '@sharedModule/components';
import { forkJoin } from 'rxjs';
import { ParentClasses } from '@sharedModule/models';
import { userAllowed } from '@sharedModule/functions';
import { ParentClassesService } from '../../service/parent-classes.service';
import { SharedService } from '@sharedModule/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'es-user-parent-classes-view',
    templateUrl: './parent-classes-view.component.html',
    styleUrls: ['./parent-classes-view.component.scss']
})
export class ParentClassesViewComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Loading;

    // Data Variables
    classDetail;
    studentList: ClassStudentsModel[] = [];

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    // search control
    searchControl = new FormControl();

    currentParentClassId: number;
    parentClassDetail: ParentClasses;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _parentClassesService: ParentClassesService,
        private _sharedService: SharedService,
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._route.paramMap.subscribe(params => {
            this.currentParentClassId = +params['params']['id'];
            this.getData();
        });
        this.initSearchControl();
    }

    initSearchControl() {
        this.searchControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(value => {
                this.rowNumber = 1;
                this.getStudentList();
            });
    }

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params.rowNumber;
        this.recordsPerPage = +params.recordsPerPage;
        this.getStudentList();
    };

    onOpenConfirmationDialog = (student: ClassStudentsModel) => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Remove Student',
                caption:
                    'Are you sure you want to remove this student from the class?',
                primaryButtonLabel: 'Remove',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeStudentFromClass(
                    student.parent_class_student_link.user.user_id
                );
            }
        });
    };

    onClassList() {
        this.router.navigate(['/' + RouteConstant.PARENT_CLASS_LIST]);
    }

    getData = () => {
        forkJoin([
            this._parentClassesService.getParentClassDetails(
                this.currentParentClassId
            ),
            this._parentClassesService.parentClassStudentList(
                this.currentParentClassId,
                this.getStudentAPIParams()
            )
        ]).subscribe(allResponses => {
            this.handelParentClassDetail(allResponses[0]);
            this.handleStudentDetail(allResponses[1]);
        });
    };

    handelParentClassDetail = response => {
        this.parentClassDetail = response['payload'];
    };

    removeStudentFromClass(userId: number) {
        const param = {
            parent_class_id: this.currentParentClassId,
            user_ids: [userId]
        };
        this._parentClassesService
            .removeStudentFromParentClass(param)
            .subscribe(response => {
                this.getStudentList();
            });
    }

    getStudentList() {
        this.currentViewType = this.viewType.Loading;
        this._parentClassesService
            .parentClassStudentList(
                this.currentParentClassId,
                this.getStudentAPIParams()
            )
            .subscribe(response => {
                this.handleStudentDetail(response);
            });
    }

    getStudentAPIParams() {
        const params = {
            showAll: false,
            rowNumber: this.rowNumber,
            recordsPerPage: this.recordsPerPage
        };
        if (this.searchControl.value) {
            params['search'] = JSON.stringify({
                name: this.searchControl.value
            });
        }
        return params;
    }

    handleStudentDetail = response => {
        this.totalElements = response.pager.totalRecords;
        this.studentList = response.payload;
        this.currentViewType = this.studentList.length
            ? this.viewType.Data
            : this.viewType.NoData;
    };
}
