import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    RouteConstant,
    PAGE_SIZE_OPTIONS,
    MIXPANEL_EVENTS,
    OperatorEnum,
    UserTypeEnum
} from '@sharedModule/constants';
import { MatDialog } from '@angular/material/dialog';
import { CreateClassDialogComponent } from '@sharedModule/components/dialogs/create-class-dialog/create-class-dialog.component';
import {
    ConfirmationMessageDialogComponent,
    FormBaseComponent
} from '@sharedModule/components';
import { Classes } from '@sharedModule/models';
import {
    getQueryParams,
    userAllowed
} from '@sharedModule/functions/common-functions';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { startWith, switchMap, catchError, debounceTime } from 'rxjs/operators';
import { merge, throwError, forkJoin } from 'rxjs';
import { ClassesService } from '../../service';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '@sharedModule/services';
import { AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { Users, Role } from '../../../user-management-module/models';
import { UsersService } from '../../../user-management-module/service/users.service';
import { ClassDetailsDialogComponent } from '../class-details-dialog/class-details-dialog.component';

@Component({
    selector: 'app-class-list',
    templateUrl: './class-list.component.html',
    styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent extends FormBaseComponent implements OnInit {
    // Angular Variables
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // State Variables
    isLoadingResults = true;

    // Form Variables
    nameFilterField: FormControl = new FormControl('');
    gradeFilterField: FormControl = new FormControl('');
    parentClassNameFilterField: FormControl = new FormControl('');
    classSearchForm: FormGroup;

    // Data related variables
    displayedColumns = [
        'name',
        'grade',
        'parentClassName',
        'teacher',
        'action'
    ];
    dataSource: Classes[] = [];
    providerId: number;
    classList = [];
    userList: Users[] = [];
    roleList: Role[] = [];

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    // Config variables
    classSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'classFilterField',
        filterControlName: 'classFilter',
        keyPath: ['full_name'],
        searchKey: 'full_name',
        searchPlaceholderLabel: 'Search Teacher',
        selectPlaceholderLabel: 'Select Teacher',
        isRequired: false,
        selectMulti: true,
        selectedValueCompairId: 'user_id',
        validationMsg: ''
    };

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _classesService: ClassesService,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService,
        fb: FormBuilder,
        private _usersService: UsersService
    ) {
        super(fb);
    }

    ngOnInit() {
        const config = this._sharedService.getUserConfig();
        this.providerId = config['provider_list'][0]['provider_id'];
        this.initializeMethod();
        this.getData();
        this._mixpanelService.track(MIXPANEL_EVENTS.CLASS_LIST, {});
    }

    getClass = () => {
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

    createSearchForm() {
        this.classSearchForm = this.createForm({
            classFilterField: ['']
        });
    }

    onEditClass(classId): void {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.CLASS_EDIT_VIEW, {});
        // const dialogRef = this.dialog.open(CreateClassDialogComponent, {
        //     panelClass: 'meeting-dialog-container',
        //     data: { edit: true, classId }
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         this.getClass();
        //     }
        // });
        const dialogRef = this.dialog.open(ClassDetailsDialogComponent, {
            panelClass: 'create-class-dialog-container',
            data: { edit: true, classId }
        });

        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.getClass();
                }
        });
    }

    onViewClass = classId => {
        this.router.navigate(['/' + RouteConstant.CLASS_VIEW, classId]);
    };

    onEnableClick = (isEnable, classId) => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.CLASS_ENABLE_DISABLE, {});
        const text = isEnable ? 'Enable' : 'Disable';
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: text + ' session',
                caption: 'Are you sure you want to ' + text.toLocaleLowerCase() + ' this session?',
                primaryButtonLabel: text,
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.enableDisableClass(isEnable, classId);
            }
        });
    };

    onCreateClassDialog(): void {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.CLASS_ADD_VIEW, {});
        // const dialogRef = this.dialog.open(CreateClassDialogComponent, {
        //     panelClass: 'meeting-dialog-container',
        //     data: { edit: false, classId: 0 }
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         this.initializeMethod();
        //     }
        // });
        const dialogRef = this.dialog.open(ClassDetailsDialogComponent, {
            panelClass: 'create-class-dialog-container',
            data: { edit: false, classId: 0 }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeMethod();
            }
        });
    }

    getClassList = () => {
        return this._classesService.listClass({
            provider_id: this.providerId,
            ...getQueryParams(
                this.getSearchParams(),
                this.sort,
                this.rowNumber,
                this.recordsPerPage
            )
        });
    };

    enableDisableClass = (isEnable, classId) => {
        const param = { is_active: isEnable ? 1 : 0 };
        this._classesService.updateClass(param, classId).subscribe(response => {
            this.getClass();
        });
    };

    cloneClass = (classId, name) => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.CLASS_CLONE_VIEW, {});
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Clone Session',
                caption: 'Are you sure you want to clone "' + name + '" session?',
                primaryButtonLabel: 'Yes',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._classesService
                    .cloneClass({ class_id: classId })
                    .subscribe(response => {
                        this.getClass();
                    });
            }
        });
    };

    handleClassList = (classList, pager) => {
        this.dataSource = classList;
        this.dataSource.map(e => {
            e.gradeName = e.grade.map(g => ' ' + g.grade_master.alias);
            e.teacherName = e.class_user_link.map(
                u =>
                    ' ' +
                    u.user_master_detail.first_name +
                    ' ' +
                    u.user_master_detail.last_name +
                    ' - ' +
                    this.getRoleName(u.user_master_detail.user_role.role_id)
            );
        });
        this.totalElements = pager['totalRecords'];
    };

    onAddStudentDialogOpen(class_id): void {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.CLASS_ADD_STUD_VIEW, {});
        const dialogRef = this.dialog.open(AddStudentDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: { class_id }
        });
        dialogRef.afterClosed().subscribe(result => {});
    }

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.getClass();
    };

    getSearchParams() {
        const params = {};
        if (this.nameFilterField.value) {
            params['name'] = this.nameFilterField.value;
        }
        if (this.gradeFilterField.value) {
            params['grade'] = this.gradeFilterField.value;
        }

        if (this.parentClassNameFilterField.value) {
            params['parent_class'] = this.parentClassNameFilterField.value;
        }
        if (
            this.formControls['classFilterField'].value &&
            this.formControls['classFilterField'].value.length > 0
        ) {
            params['user_id'] = this.formControls['classFilterField'].value.map(
                e => e.user_id
            );
        }
        return params;
    }

    initializeMethod = () => {
        this.createSearchForm();
        this.isLoadingResults = true;
        merge(
            this.sort.sortChange,
            this.nameFilterField.valueChanges,
            this.gradeFilterField.valueChanges,
            this.parentClassNameFilterField.valueChanges,
            this.formControls['classFilterField'].valueChanges
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

    onSelectChangeEvent(event, type) {
        this.formControls[type].setValue(event);
    }

    // Helpers
    get formControls() {
        return this.classSearchForm.controls;
    }

    handleUserList = list => {
        this.userList = list;
        this.userList.map(e => {
            e.full_name =
                e.user_master.first_name +
                ' ' +
                e.user_master.last_name +
                ' - ' +
                this.getRoleName(e.user_role_link.role_id);
        });
    };

    getRoleName = id => {
        const data = this.roleList.find(e => e.id == id);
        return data ? data.name : '';
    };

    handleRoleList = list => {
        this.roleList = list; //response['payload']['content'];
    };

    queryParams = (): any => {
        const criteriaArray = [];

        criteriaArray.push({
            column: 'applicationType',
            operator: OperatorEnum.EQUALS,
            values: [UserTypeEnum.PROVIDER]
        });

        criteriaArray.push({
            column: 'systemDefined',
            operator: OperatorEnum.TRUE
        });

        // criteriaArray.push({
        //     column: 'visible',
        //     operator: OperatorEnum.TRUE
        // });

        criteriaArray.push({
            column: 'active',
            operator: OperatorEnum.TRUE
        });

        return {
            offset: 0,
            limit: 100,
            criteria: criteriaArray
        };
    };

    getData = () => {
        forkJoin([
            this._usersService.getRoles(this.queryParams()),
            this._usersService.getlist({
                provider_id: this.providerId,
                isOwner: true,
                ...getQueryParams({ is_active: 1 }, null, 1, 100, true)
            })
        ]).subscribe(
            allResponses => {
                this.handleRoleList(allResponses[0]['payload']['content']);
                this.handleUserList(allResponses[1]['payload']);
            },
            err => {
                console.log(err);
            }
        );
    };

    copyStudent = classId =>{
        const dialogRef = this.dialog.open(ClassDetailsDialogComponent, {
            panelClass: 'create-class-dialog-container',
            data: { edit: true, classId, studentCopy:true }
        });

        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.getClass();
                }
        });
    }
}
