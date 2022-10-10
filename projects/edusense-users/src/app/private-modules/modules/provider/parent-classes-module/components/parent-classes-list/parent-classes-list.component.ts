import { ParentClassesDetailsDialogComponent } from './../parent-classes-details-dialog/parent-classes-details-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PAGE_SIZE_OPTIONS, RouteConstant } from '@sharedModule/constants';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { AddStudentDialogComponent } from '../../../classes-module/components';
import { merge, throwError } from 'rxjs';
import { startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { ConfirmationMessageDialogComponent } from '@sharedModule/components';
import { getQueryParams, userAllowed } from '@sharedModule/functions';
import { ParentClassesService } from '../../service';
import { ParentClasses } from '@sharedModule/models';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-parent-classes-list',
    templateUrl: './parent-classes-list.component.html',
    styleUrls: ['./parent-classes-list.component.scss']
})
export class ParentClassesListComponent implements OnInit {
    // Angular Variables
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // State Variables
    isLoadingResults = true;

    // Form Variables
    nameFilterField: FormControl = new FormControl('');
    gradeFilterField: FormControl = new FormControl('');

    // Data related variables
    displayedColumns = ['name', 'grade', 'action'];
    dataSource: ParentClasses[] = [];
    providerId: number;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _mixpanelService: MixpanelService,
        private _parentClassesService: ParentClassesService,
        private _sharedService: SharedService
    ) {}

    ngOnInit() {
        const config = this._sharedService.getUserConfig();
        this.providerId = config['provider_list'][0]['provider_id'];
        this.initializeMethod();
    }

    onViewParentClass = parentClassId => {
        this.router.navigate([
            '/' + RouteConstant.PARENT_CLASS_VIEW,
            parentClassId
        ]);
    };

    onEnableClick = (isEnable, parentClassId) => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        const text = isEnable ? 'Enable' : 'Disable';
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: text + ' Class',
                caption:
                    'Are you sure you want to ' + text + ' this class?',
                primaryButtonLabel: text,
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.enableDisableClass(isEnable, parentClassId);
            }
        });
    };

    onParentClassDetailsDialog(parentClassId?): void {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        const dialogRef = this.dialog.open(
            ParentClassesDetailsDialogComponent,
            {
                panelClass: 'meeting-dialog-container',
                data: { edit: !!parentClassId, parentClassId: parentClassId }
            }
        );

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeMethod();
            }
        });
    }

    enableDisableClass = (isEnable, parentClassId) => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this._parentClassesService
            .updateParentClass(parentClassId, isEnable ? 1 : 0)
            .subscribe(response => {
                this.getParentClass();
            });
    };

    onAddStudentDialogOpen(parentClassId): void {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        const dialogRef = this.dialog.open(AddStudentDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: { parentClassId, isParent: true }
        });
        dialogRef.afterClosed().subscribe(result => {});
    }

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.getParentClass();
    };

    getSearchParams() {
        const params = {};
        if (this.nameFilterField.value) {
            params['class_name'] = this.nameFilterField.value;
        }
        if (this.gradeFilterField.value) {
            params['alias'] = this.gradeFilterField.value;
        }
        return params;
    }

    initializeMethod = () => {
        this.isLoadingResults = true;
        merge(
            this.sort.sortChange,
            this.nameFilterField.valueChanges,
            this.gradeFilterField.valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    return this.getClassList();
                }),
                catchError(error => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe(response => {
                this.handleClassList(response['payload'], response['pager']);
                this.isLoadingResults = false;
            });
    };

    handleClassList = (parentClassList, pager) => {
        this.dataSource = parentClassList;
        this.totalElements = pager['totalRecords'];
    };

    getClassList = () => {
        return this._parentClassesService.listParentClass({
            provider_id: this.providerId,
            ...getQueryParams(
                this.getSearchParams(),
                this.sort,
                this.rowNumber,
                this.recordsPerPage
            )
        });
    };

    getParentClass = () => {
        this.isLoadingResults = true;
        this.getClassList().subscribe(
            response => {
                this.handleClassList(response['payload'], response['pager']);
                this.isLoadingResults = false;
            },
            err => {
                this.isLoadingResults = false;
            }
        );
    };
}
