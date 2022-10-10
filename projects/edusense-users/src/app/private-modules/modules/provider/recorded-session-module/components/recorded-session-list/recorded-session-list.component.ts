import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
    RouteConstant,
    PAGE_SIZE_OPTIONS,
    ViewType
} from '@sharedModule/constants';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';

import {
    ConfirmationMessageDialogComponent,
    ViewMaterialDialogComponent
} from '@sharedModule/components';
import { ProviderRecordingService } from '../../../../../services';
import { FormBaseComponent } from '@sharedModule/components';
import { RecordingSessionModel } from '../../../../../models';
import { Grade } from '@sharedModule/models/grade.model';
import { SubjectListModel } from '../../../profile-details-module/models/subject.list.model';
import { Classes } from '../../../../../../shared-module/models/classes.model';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { RecordedSessionDetailsDialogComponent } from '../recorded-session-details-dialog/recorded-session-details-dialog.component';
import { merge, throwError } from 'rxjs';
import { startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { getQueryParams } from '@sharedModule/functions';
import { Role } from '../../../user-management-module/models';

@Component({
    selector: 'app-recorded-session-list',
    templateUrl: './recorded-session-list.component.html',
    styleUrls: ['./recorded-session-list.component.scss']
})
export class RecordedSessionListComponent extends FormBaseComponent
    implements OnInit {
    classSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'classes',
        filterControlName: 'classesfltr',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search session',
        selectPlaceholderLabel: 'Select session',
        isRequired: false,
        validationMsg: '',
        selectMulti: true,
        selectedValueCompairId: 'class_id'
    };

    teacherSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'teachers',
        filterControlName: 'teachersfltr',
        keyPath: 'full_name',
        searchKey: 'full_name',
        searchPlaceholderLabel: 'Search teacher',
        selectPlaceholderLabel: 'Select teacher',
        isRequired: false,
        validationMsg: '',
        selectMulti: true,
        selectedValueCompairId: 'teacher_id'
    };

    subjectSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'subjects',
        filterControlName: 'subjectfltr',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search subject',
        selectPlaceholderLabel: 'Select subject',
        isRequired: false,
        selectMulti: true,
        validationMsg: '',
        selectedValueCompairId: 'subject_id'
    };

    // view type
    viewType = ViewType;
    currentViewType = ViewType.Loading;
    titleFormControl = new FormControl();

    // Form Variables
    recordedSessionForm: FormGroup;

    selectedTeachers: string[] = [];
    selectedTeacherIds: number[] = [];
    teacherList: any[] = [];

    selectedSubjects: string[] = [];
    selectedSubjectIds: number[] = [];
    subjectList: SubjectListModel[] = [];

    selectedClassIds: number[] = [];
    classList: [] = [];
    roleList: Role[] = [];
    sessionList: RecordingSessionModel[] = [];

    // State Variables
    selectedValue = '';
    // isLoadingResults = true;

    //sub
    recordedUploadCom$;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        protected router: Router,
        protected sharedService: SharedService,
        protected providerRecordingService: ProviderRecordingService,
        private _sharedUserService: SharedUserService,
        private activeRoute: ActivatedRoute
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
        this.onUpladComplete();
    }

    initialize = () => {
        this.createStudentSearchForm();
        // this.getRecordingSessions();
        this.routeSubscriber();
        merge(
            this.titleFormControl.valueChanges,
            this.formControls['teachers'].valueChanges,
            this.formControls['subjects'].valueChanges,
            this.formControls['classes'].valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.currentViewType = ViewType.Loading;
                    this.rowNumber = 1;
                    return this.getList();
                }),
                catchError((error) => {
                    // this.isLoadingResults = false;
                    this.currentViewType = ViewType.NoData;
                    return throwError(error);
                })
            )
            .subscribe((response) => {
                this.sessionList = [];
                this.handleRecoredSession(response);
                // this.isLoadingResults = false;
            });
    };

    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.roleList) {
                this.roleList = resolvedData.roleList;
            }
            if (resolvedData.userList) {
                this.teacherList = resolvedData.userList;
                this.teacherList.map((e) => {
                    e.full_name =
                        e.user_master.first_name +
                        ' ' +
                        e.user_master.last_name +
                        ' - ' +
                        this.getRoleName(e.user_role_link.role_id);
                });
            }
            if (resolvedData.subjectList) {
                this.subjectList = resolvedData.subjectList;
            }
            if (resolvedData.classList) {
                this.classList = resolvedData.classList;
            }
        });
    };

    createStudentSearchForm = () => {
        this.recordedSessionForm = this.createForm({
            title: [''],
            classes: [''],
            subjects: [''],
            teachers: ['']
        });
    };

    getRecordingSessions() {
        this.providerRecordingService
            .getRecordingSessions({
                ...getQueryParams(
                    this.getSearchParams(),
                    {
                        active: 'created_at',
                        direction: 'desc'
                    },
                    this.rowNumber,
                    this.recordsPerPage
                )
            })
            .subscribe((response) => {
                this.totalElements = response.pager.totalRecords;
                response.payload = response.payload.map((e) => {
                    if (e.class_map_details && e.class_map_details.length) {
                        e.class_map_details = JSON.parse(e.class_map_details);
                    }
                    if (e.subject_master) {
                        e.subject_master = JSON.parse(e.subject_master);
                    }
                    if (e.grade_master) {
                        e.grade_master = JSON.parse(e.grade_master);
                    }
                    if (e.teacher_map_details && e.teacher_map_details.length) {
                        e.teacher_map_details = JSON.parse(e.teacher_map_details);
                        e.teacher_map_details = e.teacher_map_details.map((e1) => {
                            e1.user_details = JSON.parse(e1.user_details);
                            return e1;
                        });
                    }
                    return e;
                });
                const sessions: RecordingSessionModel[] = response.payload;
                this.sessionList = this.sessionList.concat(sessions);
                this.currentViewType = this.sessionList.length
                    ? ViewType.Data
                    : ViewType.NoData;
            });
    }

    onSubmitFilterForm() {
        this.currentViewType = ViewType.Loading;
        this.sessionList = [];
        this.getRecordingSessions();
    }

    onViewMaterial = (sessionDetail: RecordingSessionModel) => {
        this.sharedService.setRecordingSessionId(sessionDetail.recording_id);
        this.router.navigate(['/' + RouteConstant.RECORDED_SESSION_VIEW]);
    };

    onStatusClick = (sessionDetail: RecordingSessionModel) => {
        const text = sessionDetail.is_active ? 'Disable' : 'Enable';
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: text + ' Recorded Session',
                caption:
                    'Are you sure you want to ' +
                    text +
                    ' this recorded session?',
                primaryButtonLabel: text,
                secondaryButtonLabel: 'Cancel',
                sessionDetail
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.callStatusChangeAPI(sessionDetail);
            }
        });
    };

    callStatusChangeAPI(sessionDetail: RecordingSessionModel) {
        const action = sessionDetail.is_active ? 0 : 1;
        const params = {
            recording_id: sessionDetail.recording_id,
            action
        };
        this.providerRecordingService
            .updateRecordingSession(params)
            .subscribe(() => {
                sessionDetail.is_active = action;
            });
    }

    onVideoPreview(sessionDetail: RecordingSessionModel) {
        const id = sessionDetail.recording_id;
        const name = sessionDetail.title;
        const url = sessionDetail.recording_path;
        const fileType = sessionDetail.content_type;
        event.stopPropagation();
        const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
            panelClass: 'view-material-dialog-container',
            data: {
                materialId: id,
                materialName: name,
                fileType: fileType,
                isAudio: false,
                fileData: url
            }
        });
        dialogRef.afterClosed().subscribe((result) => {});
    }

    onEditMaterial(recodredId): void {
        const dialogRef = this.dialog.open(
            RecordedSessionDetailsDialogComponent,
            {
                panelClass: 'add-recording-container',
                data: { edit: true, recodredId }
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.sessionList = [];
                this.initialize();
            }
        });
    }

    onAddRecordingDialog(): void {
        const dialogRef = this.dialog.open(
            RecordedSessionDetailsDialogComponent,
            {
                panelClass: 'add-recording-container',
                data: {}
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.sessionList = [];
                this.initialize();
            }
        });
    }

    onScroll = () => {
        const newRowNumber = this.rowNumber + this.recordsPerPage;
        if (newRowNumber <= this.totalElements) {
            this.rowNumber = newRowNumber;
            this.getRecordingSessions();
        }
    };

    // Helpers
    get formControls() {
        return this.recordedSessionForm.controls;
    }

    onDelete = (id) => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Delete Recorded Session',
                caption:
                    'Are you sure you want to delete this recorded session?',
                primaryButtonLabel: 'Delete',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.providerRecordingService
                    .deleteRecordingSession({ recording_id: id })
                    .subscribe(() => {
                        this.sessionList = [];
                        this.initialize();
                    });
            }
        });
    };

    onUpladComplete = () => {
        this.recordedUploadCom$ = this._sharedUserService
            .getRecordedComplate()
            .subscribe((data) => {
                if (!data) {
                    return;
                }
                this.sessionList = [];
                this.initialize();
            });
    };

    ngOnDestroy() {
        if (this.recordedUploadCom$) {
            this.recordedUploadCom$.unsubscribe();
        }
    }

    getList = () => {
        return this.providerRecordingService.getRecordingSessions({
            ...getQueryParams(
                this.getSearchParams(),
                {
                    active: 'created_at',
                    direction: 'desc'
                },
                this.rowNumber,
                this.recordsPerPage
            )
        });
    };

    getSearchParams() {
        const params = {};
        if (this.titleFormControl.value) {
            params['title'] = this.titleFormControl.value;
        }
        if (
            this.formControls['teachers'].value &&
            this.formControls['teachers'].value.length > 0
        ) {
            params['teachers'] = this.formControls['teachers'].value.map(
                (e) => e.user_id
            );
        }
        if (
            this.formControls['classes'].value &&
            this.formControls['classes'].value.length > 0
        ) {
            params['classes'] = this.formControls['classes'].value.map(
                (e) => e.class_id
            );
        }
        if (
            this.formControls['subjects'].value &&
            this.formControls['subjects'].value.length > 0
        ) {
            params['subjects'] = this.formControls['subjects'].value.map(
                (e) => e.subject_id
            );
        }
        return params;
    }

    handleRecoredSession = (response) => {
        this.totalElements = response.pager.totalRecords;
        response.payload = response.payload.map((e) => {
            if (e.class_map_details && e.class_map_details.length) {
                e.class_map_details = JSON.parse(e.class_map_details);
            }
            if (e.subject_master) {
                e.subject_master = JSON.parse(e.subject_master);
            }
            if (e.grade_master) {
                e.grade_master = JSON.parse(e.grade_master);
            }
            if (e.teacher_map_details && e.teacher_map_details.length) {
                e.teacher_map_details = JSON.parse(e.teacher_map_details);
                e.teacher_map_details = e.teacher_map_details.map((e1) => {
                    e1.user_details = JSON.parse(e1.user_details);
                    return e1;
                });
            }
            return e;
        });
        const sessions: any[] = response.payload;
        this.sessionList = this.sessionList.concat(sessions);
        this.currentViewType = this.sessionList.length
            ? ViewType.Data
            : ViewType.NoData;
    };

    onClassChange(classes: any[]) {}

    onTeacherChange(teachers: any[]) {}

    onSubjectChange(event: any) {}

    getRoleName = (id) => {
        const data = this.roleList.find((e) => e.id == id);
        return data ? data.name : '';
    };
}
