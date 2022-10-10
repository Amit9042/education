import {
    Component,
    OnInit,
    Inject,
    ElementRef,
    ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    ValidationConstant,
    CommonRegexp,
    DAYS_LIST,
    TIME_SLOT_LIST,
    OperatorEnum,
    UserTypeEnum
} from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { forkJoin, of } from 'rxjs';

import {
    Grade,
    Timezone,
    Classes,
    MaterialGrade,
    MaterialSubject
} from '@sharedModule/models';
import { hours24TimeConvert, getQueryParams } from '@sharedModule/functions';
import { ClassesService } from '../../../../private-modules/modules/provider/classes-module/service';
import { SharedUserService } from '@sharedModule/services';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { queryParamsFunction } from '../../../functions/query-params-functions';
import { SubjectListModel } from '../../../../public-modules/models/provider';
import { UsersService } from '../../../../private-modules/modules/provider/user-management-module/service';
import { MaterialService } from '../../../../private-modules/modules/provider/material-module/service';
import {
    Users,
    Role
} from '../../../../private-modules/modules/provider/user-management-module/models';

@Component({
    selector: 'app-create-class-dialog',
    templateUrl: './create-class-dialog.component.html',
    styleUrls: ['./create-class-dialog.component.scss']
})
export class CreateClassDialogComponent extends FormBaseComponent
    implements OnInit {
    // Auto chips variables
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    allTimezones: Timezone[] = [];
    daysList = DAYS_LIST;

    isEditMode = false;
    currentClassId: number;

    // Constants variables
    validationMsg = new ValidationConstant();

    //Data variable
    // subjectList: SubjectListModel[] = [];
    // gradeList: Grade[] = [];
    gradeList: MaterialGrade[] = [];
    subjectList: MaterialSubject[] = [];
    startTimeSlotList = TIME_SLOT_LIST;
    endTimeSlotList = TIME_SLOT_LIST;
    userList: Users[] = [];
    roleList: Role[] = [];

    @ViewChild('subjectInput') subjectInput: ElementRef<HTMLInputElement>;

    @ViewChild('gradeInput') gradeInput: ElementRef<HTMLInputElement>;

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'grade.alias',
        searchKey: 'grade.alias',
        searchPlaceholderLabel: 'Search grade',
        selectPlaceholderLabel: 'Select grade',
        isRequired: true,
        selectMulti: true,
        selectedValueCompairId: 'grade_id',
        validationMsg: this.validationMsg.GRADE
    };

    subjectSearchConfig: SelectSearchModel = {
        displayLabel: 'Subject',
        controlName: 'subject',
        filterControlName: 'subjectFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search subject',
        selectPlaceholderLabel: 'Select subject',
        isRequired: false,
        selectMulti: true,
        selectedValueCompairId: 'subject_id'
    };

    teacherSearchConfig: SelectSearchModel = {
        displayLabel: 'Teacher',
        controlName: 'user_id',
        filterControlName: 'teacherFilter',
        keyPath: 'full_name',
        searchKey: 'full_name',
        searchPlaceholderLabel: 'Search teacher',
        selectPlaceholderLabel: 'Select teacher',
        isRequired: false,
        validationMsg: this.validationMsg.TEACHER_NAME,
        isDisabled: false,
        selectedValueCompairId: 'user_id'
    };

    // Form group variables
    createClassForm: FormGroup;

    //data variables
    classDetail: Classes;
    providerId: number;

    constructor(
        fb: FormBuilder,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CreateClassDialogComponent>,
        private _classesService: ClassesService,
        private _sharedUserService: SharedUserService,
        private _usersService: UsersService,
        private materialService: MaterialService
    ) {
        super(fb);
    }

    ngOnInit() {
        const config = this._sharedUserService.getUserConfig();
        this.providerId = config['provider_list'][0]['provider_id'];
        this.isEditMode = this.data['edit'];
        this.currentClassId = this.data['classId'];
        // this.getTimeZone();
        this.initialize();
        // if (this.isEditMode) {
        //     this.getClassDetail();
        // }
    }

    initialize = () => {
        this.createCreateClassForm();
        this.getData();
        // this.getFilteredSubject();
        // this.getFilteredGrades();
    };

    createCreateClassForm = () => {
        this.createClassForm = this.createForm({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            grade: ['', [Validators.required]],
            days: [''],
            user_id: [''],
            subject: [''],
            time_zone: [''],
            description: [
                '',
                [Validators.minLength(2), Validators.maxLength(1000)]
            ],
            start_time: [''],
            end_time: ['']
        });
    };

    onSubmitCreateClassForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            form.value['provider_id'] = this.providerId;
            delete form.value['subjectFilter'];
            delete form.value['gradeFilter'];
            delete form.value['teacherFilter'];
            if (!form.value['days']) {
                delete form.value['days'];
            }
            if (form.value['start_time']) {
                form.value['start_time'] = this.getTwentyFourHourTime(
                    form.value['start_time']
                );
            } else {
                delete form.value['start_time'];
            }
            if (form.value['end_time']) {
                form.value['end_time'] = this.getTwentyFourHourTime(
                    form.value['end_time']
                );
            } else {
                delete form.value['end_time'];
            }
            if (form.value['time_zone']) {
                form.value['timezone_id'] = form.value['time_zone'];
            }
            delete form.value['time_zone'];
            if (this.isEditMode) {
                if (form.value['grade']) {
                    form.value['new_grade'] = form.value['grade']
                        .filter(e => {
                            return (
                                this.classDetail.grade.filter(v => {
                                    return v.grade_id == e.grade_id;
                                }).length == 0
                            );
                        })
                        .map(e => e.grade_id);
                    form.value['rem_grade'] = this.classDetail.grade
                        .filter(e => {
                            return (
                                form.value['grade'].filter(v => {
                                    return v.grade_id == e.grade_id;
                                }).length == 0
                            );
                        })
                        .map(e => e.grade_id);
                }
                if (form.value['subject']) {
                    form.value['new_subject'] = form.value['subject']
                        .filter(e => {
                            return (
                                this.classDetail.subjects.filter(v => {
                                    return v.subject_id == e.subject_id;
                                }).length == 0
                            );
                        })
                        .map(e => e.subject_id);
                    form.value['rem_subject'] = this.classDetail.subjects
                        .filter(e => {
                            return (
                                form.value['subject'].filter(v => {
                                    return v.subject_id == e.subject_id;
                                }).length == 0
                            );
                        })
                        .map(e => e.subject_id);
                }
                if (form.value['days']) {
                    form.value['new_days'] = form.value['days'].filter(
                        e => !this.classDetail.days_id.includes(e)
                    );
                    form.value['rem_days'] = this.classDetail.days_id.filter(
                        e => !form.value['days'].includes(e)
                    );
                }
                if (form.value['user_id']) {
                    if (this.classDetail.class_user_link.length == 0) {
                        form.value['new_teacher_ids'] = [
                            form.value['user_id']['user_id']
                        ];
                        form.value['remove_teacher_ids'] = [];
                    } else if (
                        this.classDetail.class_user_link[0].user_id !==
                        form.value['user_id']['user_id']
                    ) {
                        form.value['new_teacher_ids'] = [
                            form.value['user_id']['user_id']
                        ];
                        form.value['remove_teacher_ids'] = [
                            this.classDetail.class_user_link[0].user_id
                        ];
                    } else {
                        form.value['new_teacher_ids'] = [];
                        form.value['remove_teacher_ids'] = [];
                    }
                } else {
                    form.value['new_teacher_ids'] = [];
                    form.value['remove_teacher_ids'] = [];
                }
                delete form.value['user_id'];
                delete form.value['subject'];
                delete form.value['grade'];
                delete form.value['days'];
                this.editClass(form.value);
            } else {
                if (form.value['subject'] && form.value['subject'].length > 0) {
                    form.value['subject'] = form.value['subject'].map(
                        e => e.subject_id
                    );
                }
                if (form.value['grade'] && form.value['grade'].length > 0) {
                    form.value['grade'] = form.value['grade'].map(
                        e => e.grade_id
                    );
                }
                if (form.value['user_id']) {
                    form.value['teacher_ids'] = [
                        form.value['user_id']['user_id']
                    ];
                } else {
                    form.value['teacher_ids'] = [];
                }
                delete form.value['user_id'];
                this.addClass(form.value);
            }
        }
    };

    onSelectChangeEvent(event, flag) {
        this.formControls[flag].setValue(event);
    }

    // Helpers
    get formControls() {
        return this.createClassForm.controls;
    }

    onCloseDialog(flag: boolean): void {
        this.dialogRef.close(flag);
    }

    addClass = param => {
        this._classesService.addClass(param).subscribe(response => {
            this.onCloseDialog(true);
        });
    };

    editClass = param => {
        this._classesService
            .editClass(param, this.currentClassId)
            .subscribe(response => {
                this.onCloseDialog(true);
            });
    };

    onSelectStartTime(event) {
        const selectedValue = event.value;
        const index = this.startTimeSlotList.findIndex(
            e => e.label == selectedValue
        );
        this.endTimeSlotList = this.startTimeSlotList.slice(
            index + 1,
            this.startTimeSlotList.length
        );
        this.formControls['end_time'].setValue('');
    }

    handelClassDetail = response => {
        this.classDetail = response['payload'];
        if (this.classDetail.start_time) {
            this.classDetail.start_time = hours24TimeConvert(
                this.classDetail.start_time
            );
        }
        if (this.classDetail.end_time) {
            this.classDetail.end_time = hours24TimeConvert(
                this.classDetail.end_time
            );
        }
        this.classDetail.days_id = this.classDetail.days.map(e => e.day);

        this.classDetail.selectedGrades = this.classDetail.grade.map(e => {
            {
                return {
                    grade_id: e.grade_id,
                    name: e.grade_master.name
                } as Grade;
            }
        });
        this.classDetail.selectedSubjects = this.classDetail.subjects.map(e => {
            {
                return {
                    subject_id: e.subject_id,
                    name: e.subject_master.name
                } as SubjectListModel;
            }
        });
        this.createClassForm.patchValue({
            name: this.classDetail.name,
            days: this.classDetail.days_id,
            time_zone: this.classDetail.timezone_id,
            description: this.classDetail.description,
            start_time: this.classDetail.start_time,
            end_time: this.classDetail.end_time
        });
        if (this.classDetail.class_user_link.length > 0) {
            this.classDetail.selectedTeacher = this.userList.find(
                e => e.user_id === this.classDetail.class_user_link[0].user_id
            );
        }
    };

    handleTimezone = response => {
        this.allTimezones = response;
    };

    getTwentyFourHourTime = amPmString => {
        var d = new Date('1/1/2013 ' + amPmString);
        return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };

    getData = () => {
        forkJoin([
            this.materialService.getGradeList(
                queryParamsFunction({}, null, 1, 100, true)
            ),
            this.materialService.getSubList(
                queryParamsFunction({}, null, 1, 100, true)
            ),
            this._classesService.getTimezoneList(
                queryParamsFunction({ is_active: 1 }, null, 1, 100, true)
            ),
            this._usersService.getRoles(this.queryParams()),
            this._usersService.getlist({
                provider_id: this.providerId,
                isOwner: true,
                ...getQueryParams({ is_active: 1 }, null, 1, 100, true)
            }),
            this.isEditMode
                ? this._classesService.getClassDetails(this.currentClassId)
                : of([])
        ]).subscribe(
            allResponses => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleSubList(allResponses[1]['payload']);
                this.handleTimezone(allResponses[2]['payload']);
                this.handleRoleList(allResponses[3]['payload']['content']);
                this.handleUserList(allResponses[4]['payload']);
                if (this.isEditMode) {
                    this.handelClassDetail(allResponses[5]);
                }
            },
            err => {
                console.log(err);
            }
        );
    };

    handleGradeList = list => {
        this.gradeList = list;
    };

    handleSubList = list => {
        this.subjectList = list;
    };

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
}
