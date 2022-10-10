import {
    Component,
    OnInit,
    Inject,
    ElementRef,
    ViewChild,
    Input
} from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import {
    ValidationConstant,
    CommonRegexp,
    OperatorEnum,
    UserTypeEnum
} from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { forkJoin, of } from 'rxjs';
import { UsersService } from '../../../user-management-module/service';
import { MaterialService } from '../../../material-module/service';
import { ClassesService } from '../../../classes-module/service';
import {
    queryParamsFunction,
    getQueryParams,
    bytesToSizeInMB
} from '@sharedModule/functions';
import { Role, Users } from '../../../user-management-module/models';
import { MaterialGrade, MaterialSubject, Classes } from '@sharedModule/models';
import { RecordingSessionModel } from '../../../../../models';
import { SharedUserService, SharedService } from '@sharedModule/services';
import { ProviderRecordingService } from '../../../../../services';
import { ALLOWED_MATERIAL_VIDEO_FILE_TYPES } from '@sharedModule/constants';

@Component({
    selector: 'es-user-recorded-session-details-dialog',
    templateUrl: './recorded-session-details-dialog.component.html',
    styleUrls: ['./recorded-session-details-dialog.component.scss']
})
export class RecordedSessionDetailsDialogComponent extends FormBaseComponent
    implements OnInit {
    @Input() dropdownData: any;

    // Form group variables
    editRecordSessionForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();
    fileType = ALLOWED_MATERIAL_VIDEO_FILE_TYPES;

    //Data variable
    gradeList: MaterialGrade[] = [];
    subjectList: MaterialSubject[] = [];
    teacherList: Users[] = [];
    roleList: Role[] = [];
    classList: Classes[] = [];
    uploadFile = [];
    isEditMode = false;
    currentRecordedId: number;
    recordedDetail: RecordingSessionModel;
    providerId: number;
    selectedTeacher: Users[] = [];
    selectedclass: Classes[] = [];
    selectedGrade: MaterialGrade;
    selectedsubject: MaterialSubject;
    filterTypeShow;

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'grade.alias',
        searchKey: 'grade.alias',
        searchPlaceholderLabel: 'Search Grade',
        selectPlaceholderLabel: 'Select Grade',
        isRequired: true,
        validationMsg: this.validationMsg.GRADE
    };

    classSearchConfig: SelectSearchModel = {
        displayLabel: 'Session',
        controlName: 'class',
        filterControlName: 'classFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search Session',
        selectPlaceholderLabel: 'Select Session',
        isRequired: true,
        selectMulti: true,
        selectedValueCompairId: 'class_id',
        validationMsg: this.validationMsg.CLASS
    };

    subjectSearchConfig: SelectSearchModel = {
        displayLabel: 'Subject',
        controlName: 'subject',
        filterControlName: 'subjectFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search subject',
        selectPlaceholderLabel: 'Select subject',
        isRequired: true,
        validationMsg: this.validationMsg.SUBJECT
    };

    teacherSearchConfig: SelectSearchModel = {
        displayLabel: 'Teacher',
        controlName: 'teacher',
        filterControlName: 'teacherFilter',
        keyPath: 'full_name',
        searchKey: 'full_name',
        searchPlaceholderLabel: 'Search Teacher',
        selectPlaceholderLabel: 'Select Teacher',
        isRequired: false,
        selectMulti: true,
        selectedValueCompairId: 'user_id',
        validationMsg: this.validationMsg.TEACHER_NAME
    };

    constructor(
        fb: FormBuilder,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<RecordedSessionDetailsDialogComponent>,
        private _usersService: UsersService,
        private materialService: MaterialService,
        private _classesService: ClassesService,
        private _sharedUserService: SharedUserService,
        protected providerRecordingService: ProviderRecordingService,
        private sharedService: SharedService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.filterTypeShow = 'Allowed video type list \n\n' + this.fileType;
        const config = this._sharedUserService.getUserConfig();
        this.providerId = config['provider_list'][0]['provider_id'];
        this.isEditMode = this.data['edit'];
        this.currentRecordedId = this.data['recodredId'];
        this.initialize();
    }

    initialize = () => {
        this.createEditSessionForm();
        this.getData();
    };

    // Create form method
    createEditSessionForm = () => {
        this.editRecordSessionForm = this.createForm({
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            grade: ['', [Validators.required]],
            class: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            teacher: ['']
        });
    };

    // Submit form method
    onSubmitEditSessionForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            var values = { ...form.value };
            delete values['classFilter'];
            delete values['gradeFilter'];
            delete values['subjectFilter'];
            delete values['teacherFilter'];
            values['grade_id'] = values['grade']['grade_id'];
            delete values['grade'];
            values['subject_id'] = values['subject']['subject_id'];
            delete values['subject'];
            if (this.isEditMode) {
                values['add_class_ids'] = values['class']
                    .filter(e => {
                        return (
                            this.recordedDetail.class_map_details.filter(v => {
                                return v.class_id == e.class_id;
                            }).length == 0
                        );
                    })
                    .map(e => e.class_id);
                values[
                    'remove_class_ids'
                ] = this.recordedDetail.class_map_details
                    .filter(e => {
                        return (
                            values['class'].filter(v => {
                                return v.class_id == e.class_id;
                            }).length == 0
                        );
                    })
                    .map(e => e.class_id);
                delete values['class'];
                values['add_teacher_ids'] = values['teacher']
                    .filter(e => {
                        return (
                            this.recordedDetail.teacher_map_details.filter(v => {
                                return v.user_id == e.user_id;
                            }).length == 0
                        );
                    })
                    .map(e => e.user_id);
                values[
                    'remove_teacher_ids'
                ] = this.recordedDetail.teacher_map_details
                    .filter(e => {
                        return (
                            values['teacher'].filter(v => {
                                return v.user_id == e.user_id;
                            }).length == 0
                        );
                    })
                    .map(e => e.user_id);
                delete values['teacher'];
                this.editRecordingSession(values);
            } else {
                if (values['teacher']) {
                    values['teacher_ids'] = values['teacher'].map(e => e.user_id);
                }
                delete values['teacher'];
                values['class_ids'] = values['class'].map(e => e.class_id);
                delete values['class'];
                if (this.uploadFile.length <= 0) {
                    this.sharedService.setSnackBar('Video file is required');
                    return;
                }
                this.addRecordedSession(values);
            }
        }
    };

    // Helpers
    get formControls() {
        return this.editRecordSessionForm.controls;
    }

    // Action method
    onCloseDialog(flag: boolean): void {
        this.dialogRef.close(flag);
    }

    onFileUpload = event => {
        if (event.target.files && event.target.files[0]) {
            const validType = this.fileType.includes(
                event.target.files[0].type
            );
            if (validType) {
                const maxAllowedSize = 1024;
                if (
                    bytesToSizeInMB(event.target.files[0].size) > maxAllowedSize
                ) {
                    this.sharedService.setSnackBar(
                        'Max file size allowed ' + maxAllowedSize + ' mb'
                    );
                    return;
                }
                this.uploadFile = [
                    {
                        reqKey: 'recording',
                        files: [...event.target.files]
                    }
                ];
            } else {
                this.sharedService.setSnackBar('Please upload a valid file');
            }
        }
        event.target.value = null;
    };

    onBrowseFile(id) {
        document.getElementById(id).click();
    }

    onSelectChangeEvent = (event, type) => {
        switch (type) {
            case 'subject':
                this.formControls[type].setValue(event);
                break;
            case 'grade':
                this.formControls[type].setValue(event);
                break;
            case 'class':
                this.formControls[type].setValue(event);
                break;
            case 'teacher':
                this.formControls[type].setValue(event);
                break;
        }
    };

    getData = () => {
        forkJoin([
            this.materialService.getGradeList(
                queryParamsFunction({}, null, 1, 100, true)
            ),
            this.materialService.getSubList(
                queryParamsFunction({}, null, 1, 100, true)
            ),
            this._classesService.listClass({
                provider_id: this.providerId,
                ...getQueryParams({is_active: 1}, null, 1, 100, true)
            }),
            this._usersService.getRoles(this.queryParams()),
            this._usersService.getlist({
                provider_id: this.providerId,
                isOwner: true,
                ...getQueryParams({ is_active: 1 }, null, 1, 100, true)
            }),
            this.isEditMode
                ? this.providerRecordingService.getRecordingSession(
                      this.currentRecordedId
                  )
                : of([])
        ]).subscribe(
            allResponses => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleSubList(allResponses[1]['payload']);
                this.handleClassList(allResponses[2]['payload']);
                this.handleRoleList(allResponses[3]['payload']['content']);
                this.handleUserList(allResponses[4]['payload']);
                if (this.isEditMode) {
                    this.handelRecordedDetail(allResponses[5]['payload']);
                }
            },
            err => {
                console.log(err);
            }
        );
    };

    handelRecordedDetail = detail => {
        this.recordedDetail = detail;
        this.selectedGrade = this.gradeList.find(
            e => e.grade_id === detail['grade_master']['grade_id']
        );
        this.selectedsubject = this.subjectList.find(
            e => e.subject_id === detail['subject_master']['subject_id']
        );
        this.selectedclass = this.classList.filter(e =>
            detail['class_map_details'].find(e1 => e1.class_id == e.class_id)
        );
        this.selectedTeacher = this.teacherList.filter(e =>
            detail['teacher_map_details'].find(e1 => e1.user_id == e.user_id)
        );
        // this.selectedTeacher = detail['teacher_map_details'].map(e => e.user_id);
        this.editRecordSessionForm.patchValue({
            title: this.recordedDetail.title
        });
        this.uploadFile = [
            {
                files: [
                    {
                        name: this.recordedDetail.title
                    }
                ]
            }
        ];
    };

    handleGradeList = list => {
        this.gradeList = list;
    };

    handleSubList = list => {
        this.subjectList = list;
    };

    handleClassList = list => {
        this.classList = list;
    };

    handleUserList = list => {
        this.teacherList = list;
        this.teacherList.map(e => {
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

    addRecordedSession = params => {
        // this.providerRecordingService
        //     .addRecordingSession(params, this.uploadFile)
        //     .subscribe(res => {
        //         this.onCloseDialog(true);
        //     });
        this._sharedUserService.setMaterialUpload({
            param: params,
            materialFile: this.uploadFile,
            isMaterial: false
        });
        this.sharedService.setSnackBar(
            'Recorded Session Uploading Started in Background'
        );
        this.onCloseDialog(false);
    };

    editRecordingSession = params => {
        this.providerRecordingService
            .editRecordingSession(params, this.currentRecordedId)
            .subscribe(res => {
                this.onCloseDialog(true);
            });
    };
}
