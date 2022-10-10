import { Component, OnInit } from '@angular/core';
import {
    FormBaseComponent,
    ViewMaterialDialogComponent
} from '@sharedModule/components';
import {
    ViewType,
    PAGE_SIZE_OPTIONS,
    RouteConstant,
    OperatorEnum
} from '@sharedModule/constants';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '@sharedModule/services';
import { RecordedService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { merge, throwError, forkJoin } from 'rxjs';
import { startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { getQueryParams } from '@sharedModule/functions';
import { StudentClassesService } from '../../../../../services/student-classes/student-classes.service';
import { StudentClasses } from '@sharedModule/models';
import { MaterialService } from '../../../student-material-module/service';
import { Teacher, RecordingSessionModel } from '../../models';
import { UserTypeEnum } from '@sharedModule/constants';
import { EnterpriseDetail } from '../../../../../../public-modules/models';

@Component({
    selector: 'es-user-student-recorded-list',
    templateUrl: './student-recorded-list.component.html',
    styleUrls: ['./student-recorded-list.component.scss']
})
export class StudentRecordedListComponent extends FormBaseComponent
    implements OnInit {
    classSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'classes',
        filterControlName: 'classesfltr',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search class',
        selectPlaceholderLabel: 'Select class',
        isRequired: false,
        validationMsg: '',
        selectMulti: true,
        selectedValueCompairId: 'class_id'
    };

    teacherSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'teacher',
        filterControlName: 'teacherfltr',
        keyPath: 'fullName',
        searchKey: 'fullName',
        searchPlaceholderLabel: 'Search Teacher',
        selectPlaceholderLabel: 'Select Teacher',
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
        validationMsg: '',
        selectMulti: true,
        selectedValueCompairId: 'subject_id'
    };

    // view type
    viewType = ViewType;
    currentViewType = ViewType.Loading;

    // Form Variables
    recordedSessionForm: FormGroup;
    titleFormControl = new FormControl();

    // Datasourse variables
    classList: StudentClasses[] = [];
    selectedTeachar: string[] = [];
    selectedTeacharIds: number[] = [];
    teacharList: Teacher[] = [];

    selectedClassIds: number[] = [];
    // classList: [] = [];

    sessionList: RecordingSessionModel[] = [];

    selectedSubjects: string[] = [];
    selectedSubjectIds: number[] = [];
    subjectList: any[] = [];
    roleList: any[] = [];

    // State Variables
    selectedValue = '';

    // isLoadingResults = true;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    activeEnterprise: EnterpriseDetail;

    constructor(
        fb: FormBuilder,
        protected router: Router,
        public dialog: MatDialog,
        protected sharedService: SharedService,
        private _recordedService: RecordedService,
        private _studentClassesService: StudentClassesService,
        private materialService: MaterialService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.initialize();
        this.getData();
    }

    initialize = () => {
        this.createStudentSearchForm();
        // this.getRecordingSessions();
        merge(
            this.titleFormControl.valueChanges,
            this.formControls['teacher'].valueChanges,
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

    createStudentSearchForm = () => {
        this.recordedSessionForm = this.createForm({
            title: [''],
            classes: [''],
            teacher: [''],
            subjects: ['']
        });
    };

    getRecordingSessions() {
        this._recordedService
            .getRecordedList({
                providerUUID: this.activeEnterprise['provider_uuid'],
                ...getQueryParams(
                    this.getSearchParams(),
                    null,
                    this.rowNumber,
                    this.recordsPerPage
                )
            })
            .subscribe((response) => {
                this.handleRecoredSession(response);
            });
    }

    handleRecoredSession = (response) => {
        this.totalElements = response.pager.totalRecords;
        const sessions: any[] = response.payload;
        this.sessionList = this.sessionList.concat(sessions);
        this.currentViewType = this.sessionList.length
            ? ViewType.Data
            : ViewType.NoData;
    };

    onSubmitFilterForm() {
        this.currentViewType = ViewType.Loading;
        this.sessionList = [];
        this.getRecordingSessions();
    }

    onClassChange(classes: any[]) {
        this.selectedClassIds = [];
        for (const classDetail of classes) {
            this.selectedClassIds.push(classDetail.class_id);
        }
    }

    onTeacherChange(teachers: any[]) {
        this.selectedTeacharIds = [];
        for (const classDetail of teachers) {
            this.selectedTeacharIds.push(classDetail.class_id);
        }
    }

    onSubjectChange(event: any) {
        // const subjects: any[] = event.value;
        // console.log(subjects);
        // for (const subject of subjects) {
        //     this.selectedSubjectIds.push(subject.subject_id);
        //     this.selectedSubjects.push(subject.name);
        // }
    }

    onClearFilter() {
        this.currentViewType = ViewType.Loading;
        this.sessionList = [];
        this.recordedSessionForm.reset();
        this.selectedValue = '';
        this.selectedClassIds = [];
        this.selectedTeacharIds = [];
        this.titleFormControl.reset();
        this.getRecordingSessions();
    }

    onViewMaterial = (sessionDetail: any) => {
        this.sharedService.setRecordingSessionId(sessionDetail.recording_id);
        this.router.navigate([
            '/' + RouteConstant.STUDENT_RECORDED_SESSION_VIEW
        ]);
    };

    onVideoPreview(sessionDetail): void {
        event.stopPropagation();
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

    getList = () => {
        return this._recordedService.getRecordedList({
            providerUUID: this.activeEnterprise['provider_uuid'],
            ...getQueryParams(
                this.getSearchParams(),
                null,
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
            this.formControls['teacher'].value &&
            this.formControls['teacher'].value.length > 0
        ) {
            params['teachers'] = this.formControls['teacher'].value.map(
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

    getData = () => {
        forkJoin([
            this._recordedService.getRoles(this.queryParams()),
            this._recordedService.getSub({providerUUID: this.activeEnterprise['provider_uuid']}),
            this._studentClassesService.classList({
                providerUUID: this.activeEnterprise['provider_uuid'],
                ...getQueryParams({}, null, 1, 100, true)
            }),
            this._recordedService.getTeacherList({
                providerUUID: this.activeEnterprise['provider_uuid'],
                ...getQueryParams({}, null, 1, 100, true)
            })
        ]).subscribe(
            (allResponses) => {
                this.handleRoleList(allResponses[0]['payload']['content']);
                this.handleSubList(allResponses[1]['payload']);
                this.handleClassList(allResponses[2]['payload']);
                this.handleTeacherList(allResponses[3]['payload']);
            },
            (err) => {
                console.log(err);
            }
        );
    };

    handleClassList = (list) => {
        this.classList = list;
        this.classList.map((e) => (e.name = e.class_details.name));
    };

    handleSubList = (list) => {
        this.subjectList = list;
    };

    handleRoleList = (list) => {
        this.roleList = list;
    };

    handleTeacherList = (list) => {
        this.teacharList = list;
        this.teacharList.map(
            (e) =>
                (e.fullName =
                    e.user_details.first_name +
                    ' ' +
                    e.user_details.last_name +
                    ' - ' +
                    this.getRoleName(e.role_id))
        );
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

    getRoleName = (id) => {
        const data = this.roleList.find((e) => e.id == id);
        return data ? data.name : '';
    };
}
