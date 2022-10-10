import {
    Component,
    OnInit,
    Inject,
    ElementRef,
    ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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

import {
    Grade,
    Timezone,
    Classes,
    MaterialGrade,
    MaterialSubject,
    ParentClasses
} from '@sharedModule/models';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { forkJoin, of } from 'rxjs';
import { ClassesService } from '../../service';
import { UsersService } from '../../../user-management-module/service';
import { MaterialService } from '../../../material-module/service';
import { SharedUserService } from '@sharedModule/services';
import {
    hours24TimeConvert,
    queryParamsFunction,
    getQueryParams,
    getTimeSlots
} from '@sharedModule/functions';
import { ParentClassesService } from '../../../parent-classes-module/service';
import { StudentService } from '../../../student-module/service';
import { Student } from '../../../student-module/models';
import {
    ClassStudentsModel,
    SearchStudentForClassModel
} from '../../../../../models';

@Component({
    selector: 'es-user-class-details-dialog',
    templateUrl: './class-details-dialog.component.html',
    styleUrls: ['./class-details-dialog.component.scss']
})
export class ClassDetailsDialogComponent extends FormBaseComponent
    implements OnInit {
    // Static varibales
    isSelectClass = false;

    // Auto chips variables
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    allTimezones: Timezone[] = [];
    daysList = DAYS_LIST;

    isEditMode = false;
    studentCopy = false;
    currentClassId: number;

    // Constants variables
    validationMsg = new ValidationConstant();

    //Data variable
    parentClassList: ParentClasses[] = [];
    gradeList: MaterialGrade[] = [];
    subjectList: MaterialSubject[] = [];
    startTimeSlotList = getTimeSlots();
    endTimeSlotList = [...this.startTimeSlotList];
    userList: any = [];
    roleList: any = [];
    studentList: ClassStudentsModel[] = [];
    classStudentList: number[] = [];

    @ViewChild('subjectInput') subjectInput: ElementRef<HTMLInputElement>;

    @ViewChild('gradeInput') gradeInput: ElementRef<HTMLInputElement>;

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search grade',
        selectPlaceholderLabel: 'Select grade',
        isRequired: true,
        selectMulti: false,
        selectedValueCompairId: 'grade_id',
        validationMsg: this.validationMsg.GRADE
    };

    parentClassSearchConfig: SelectSearchModel = {
        displayLabel: 'Class Name',
        controlName: 'parent_class',
        filterControlName: 'parentFilter',
        keyPath: 'class_name',
        searchKey: 'class_name',
        searchPlaceholderLabel: 'Search class name',
        selectPlaceholderLabel: 'Select class name',
        isRequired: true,
        selectMulti: false,
        selectedValueCompairId: 'parent_id',
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
        selectMulti: false,
        selectedValueCompairId: 'subject_id',
        validationMsg: this.validationMsg.SUBJECT
    };

    teacherSearchConfig: SelectSearchModel = {
        displayLabel: 'Teacher',
        controlName: 'user_id',
        filterControlName: 'teacherFilter',
        keyPath: 'full_name',
        searchKey: 'full_name',
        searchPlaceholderLabel: 'Search teacher',
        selectPlaceholderLabel: 'Select teacher',
        isRequired: true,
        validationMsg: this.validationMsg.TEACHER_NAME,
        isDisabled: false,
        selectedValueCompairId: 'user_id'
    };

    // Form group variables
    createClassForm: FormGroup;
    selectClassForm: FormGroup;

    //data variables
    classDetail: Classes;
    providerId: number;

    constructor(
        fb: FormBuilder,
        private _fb: FormBuilder,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ClassDetailsDialogComponent>,
        private _classesService: ClassesService,
        private _parentClassesService: ParentClassesService,
        private _usersService: UsersService,
        private _sharedUserService: SharedUserService,
        private materialService: MaterialService,
        private _studentService: StudentService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        const config = this._sharedUserService.getUserConfig();
        this.providerId = config['provider_list'][0]['provider_id'];
        this.isEditMode = this.data['edit'];
        this.currentClassId = this.data['classId'];
        this.studentCopy = this.data['studentCopy'];
        if (this.studentCopy) {
            this.isSelectClass = true;
        }
        this.createCreateClassForm();
        this.createSelectClassForm();
        this.getData();
    };

    createCreateClassForm = () => {
        this.createClassForm = this.createForm(
            {
                grade: ['', [Validators.required]],
                parent_class: ['', [Validators.required]],
                class_name: [
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
                days: [''],
                subject: [''],
                user_id: [''],
                time_zone: [''],
                description: [
                    '',
                    [Validators.minLength(2), Validators.maxLength(1000)]
                ],
                start_time: [
                    '',
                    [Validators.pattern(CommonRegexp.START_END_TIME_REGEX)]
                ],
                end_time: [
                    '',
                    [Validators.pattern(CommonRegexp.START_END_TIME_REGEX)]
                ]
            },
            { validator: this.validate }
        );
    };

    createSelectClassForm = () => {
        this.selectClassForm = this._fb.group({
            rowFields: this._fb.array([])
        });
    };

    createSelectClassRowField(index, stud: ClassStudentsModel): FormGroup {
        return this.fb.group({
            select_checkbox: [stud.isSelected],
            image: [stud.parent_class_student_link.user.avatar_thumbnail],
            name: [
                stud.parent_class_student_link.user.first_name +
                    ' ' +
                    stud.parent_class_student_link.user.last_name
            ],
            location: [this.getLocation(index)],
            school: [stud.parent_class_student_link.school_name],
            id: [stud.parent_class_student_link.user.user_id]
        });
    }

    onSubmitCreateClassForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            this.onNextClick(form);
        }
    };

    onSubmitSelectClassForm = (form1: FormGroup) => {
        if (this.onSubmit(form1)) {
            this.onFormSubmit(form1);
        }
    };

    onSelectChangeEvent(event, flag) {
        if (flag === 'grade') {
            this.getParentClassList(event);
        }
        this.formControls[flag].setValue(event);
    }

    // Helpers
    get formControls() {
        return this.createClassForm.controls;
    }

    // get selectFormControls() {
    //     return this.selectClassForm.controls;
    // }

    formArrayControls(): FormArray {
        return this.selectClassForm.get('rowFields') as FormArray;
    }

    onCloseDialog(flag: boolean): void {
        this.dialogRef.close(flag);
    }

    onNextClick(form) {
        this.studentList = [];
        this.createSelectClassForm();
        if (this.isEditMode) {
            if (this.classDetail.parent_class_id) {
                this.getParentClassStudentList(
                    this.classDetail.parent_class_id
                );
            } else {
                this.onFormSubmit(null);
            }
        } else {
            this.getParentClassStudentList(
                form.value['parent_class']['parent_class_id']
            );
        }
    }

    onBacktoClassForm() {
        this.isSelectClass = false;
    }

    onSelectStartTime(event) {
        // const selectedValue = event.value;
        // const index = this.startTimeSlotList.findIndex(
        //     (e) => e.label == selectedValue
        // );
        // this.endTimeSlotList = this.startTimeSlotList.slice(
        //     index + 1,
        //     this.startTimeSlotList.length
        // );
        // this.formControls['end_time'].setValue('');
    }

    getTwentyFourHourTime = (amPmString) => {
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
                : of([]),
            this.isEditMode
                ? this._classesService.classStudentList(this.currentClassId, {
                      ...getQueryParams({}, null, 1, 100, true)
                  })
                : of([])
        ]).subscribe(
            (allResponses) => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleSubList(allResponses[1]['payload']);
                this.handleTimezone(allResponses[2]['payload']);
                this.handleRoleList(allResponses[3]['payload']['content']);
                this.handleUserList(allResponses[4]['payload']);
                if (this.isEditMode) {
                    this.handelClassDetail(allResponses[5]);
                    this.handleClassStudentsList(allResponses[6]);
                }
            },
            (err) => {
                console.log(err);
            }
        );
    };

    handleGradeList = (list) => {
        this.gradeList = list;
        this.gradeList.map((e) => (e.name = e.grade.alias));
    };

    handleSubList = (list) => {
        this.subjectList = list;
    };

    handleUserList = (list) => {
        this.userList = list;
        this.userList.map((e) => {
            e.full_name =
                e.user_master.first_name +
                ' ' +
                e.user_master.last_name +
                ' - ' +
                this.getRoleName(e.user_role_link.role_id);
        });
    };

    getRoleName = (id) => {
        const data = this.roleList.find((e) => e.id == id);
        return data ? data.name : '';
    };

    handleRoleList = (list) => {
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

    handleTimezone = (response) => {
        this.allTimezones = response;
    };

    handleParentClass = (response) => {
        this.parentClassList = response;
    };

    handelClassDetail = (response) => {
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

        this.classDetail.days_id = this.classDetail.days.map((e) => e.day);

        this.classDetail.selectedGrade = this.gradeList.find(
            (e) =>
                e.grade_id ===
                (this.classDetail.grade.length > 0
                    ? this.classDetail.grade[0].grade_id
                    : 0)
        );
        this.getParentClassList(this.classDetail.selectedGrade);
        this.classDetail.selectedSubject = this.subjectList.find(
            (e) =>
                e.subject_id ===
                (this.classDetail.subjects.length > 0
                    ? this.classDetail.subjects[0].subject_id
                    : 0)
        );
        this.createClassForm.patchValue({
            class_name: this.classDetail.name,
            days: this.classDetail.days_id,
            time_zone: this.classDetail.timezone_id,
            description: this.classDetail.description,
            start_time: this.classDetail.start_time,
            end_time: this.classDetail.end_time
        });
        if (this.classDetail.class_user_link.length > 0) {
            this.classDetail.selectedTeacher = this.userList.find(
                (e) => e.user_id === this.classDetail.class_user_link[0].user_id
            );
        }
        this.copyStudent();
    };

    getParentClassList = (event: any) => {
        this._parentClassesService
            .listParentClass({
                provider_id: this.providerId,
                ...getQueryParams(
                    {
                        grade_id: event['grade_id'],
                        ...((!this.classDetail ||
                            !this.classDetail.parent_class_id) && {
                            is_active: 1
                        })
                    },
                    null,
                    1,
                    100,
                    true
                )
            })
            .subscribe((res) => {
                this.parentClassList = res['payload'];
                if (this.isEditMode) {
                    this.classDetail.selectedParentClass = this.parentClassList.find(
                        (e) =>
                            e.parent_class_id ==
                            this.classDetail.parent_class_id
                    );
                    if (this.classDetail.selectedParentClass) {
                        this.createClassForm.controls['parent_class'].disable();
                        this.createClassForm.controls['grade'].disable();
                    }
                }
            });
    };

    getParentClassStudentList = (parentClassId) => {
        this._parentClassesService
            .parentClassStudentList(parentClassId, {
                ...getQueryParams({}, null, 1, 100, true)
            })
            .subscribe((res) => {
                this.studentList = res['payload'];
                this.studentList.map((item, i) => {
                    item.isSelected = this.isEditMode
                        ? this.classStudentList.includes(
                              item.parent_class_student_link.user.user_id
                          )
                        : true;
                });

                this.studentList = this.studentList.sort((x) =>
                    !x.isSelected ? -1 : 1
                );

                this.studentList.map((item, i) => {
                    let items = this.formArrayControls();
                    items.push(this.createSelectClassRowField(i, item));
                });
                this.isSelectClass = true;
            });
    };

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/studentProfile.svg';
    };

    getLocation = (index: number) => {
        let locationName = '';
        if (this.studentList[index].parent_class_student_link.student_city) {
            locationName += this.studentList[index].parent_class_student_link
                .student_city.city_name;
        }
        if (this.studentList[index].parent_class_student_link.student_state) {
            locationName ? (locationName += ', ') : '';
            locationName += this.studentList[index].parent_class_student_link
                .student_state.state_name;
        }
        if (this.studentList[index].parent_class_student_link.student_country) {
            locationName ? (locationName += ', ') : '';
            locationName += this.studentList[index].parent_class_student_link
                .student_country.country_name;
        }
        return locationName;
    };

    onSelectAll = (event) => {
        this.formArrayControls().controls.forEach((control) => {
            control.get('select_checkbox').patchValue(event['checked']);
        });
    };

    getSelectAllValue = () => {
        return this.formArrayControls().controls.every(
            (e) => e.get('select_checkbox').value == true
        );
    };

    addClass = (param) => {
        this._classesService.addClass(param).subscribe((response) => {
            this.onCloseDialog(true);
        });
    };

    editClass = (param) => {
        this._classesService
            .editClass(param, this.currentClassId)
            .subscribe((response) => {
                this.onCloseDialog(true);
            });
    };

    handleClassStudentsList = (res) => {
        this.classStudentList = res['payload'].map(
            (e) => e.Student_detail.user.user_id
        );
    };

    copyStudent = () => {
        if (this.studentCopy) {
            this.getParentClassStudentList(this.classDetail.parent_class_id);
            this.formControls['user_id'].setValue(
                this.classDetail.selectedTeacher
            );
            this.formControls['subject'].setValue(
                this.classDetail.selectedSubject
            );
        }
    };

    validate(createClassFormGroup: FormGroup) {
        const startTime = createClassFormGroup.controls.start_time;
        const endtime = createClassFormGroup.controls.end_time;
        if (!endtime.value || endtime.value.length <= 0) {
            return null;
        }
        if (!startTime.value || startTime.value.length === 0) {
            return null;
        }
        var d = new Date('1/1/2013 ' + startTime.value);
        var d1 = new Date('1/1/2013 ' + endtime.value);
        if (d.getTime() > d1.getTime()) {
            endtime.setErrors({ incorrect: true });
            return {
                endTimeGreater: true
            };
        } else {
            endtime.setErrors(null);
        }
        return null;
    }

    onFormSubmit(form1) {
        const studentIds = form1
            ? form1.value['rowFields']
                  .filter((e) => e.select_checkbox === true)
                  .map((e) => e.id)
            : null;

        let form = { value: {} };
        form['value'] = this.createClassForm.value;
        form.value['provider_id'] = this.providerId;
        delete form.value['subjectFilter'];
        delete form.value['gradeFilter'];
        delete form.value['parentFilter'];
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

        form.value['name'] = form.value['class_name'];
        delete form.value['class_name'];
        if (this.isEditMode) {
            if (form.value['days']) {
                form.value['new_days'] = form.value['days'].filter(
                    (e) => !this.classDetail.days_id.includes(e)
                );
                form.value['rem_days'] = this.classDetail.days_id.filter(
                    (e) => !form.value['days'].includes(e)
                );
            }

            if (studentIds) {
                form.value['new_user_ids'] = studentIds.filter(
                    (e) => !this.classStudentList.includes(e)
                );
                form.value['remove_user_ids'] = this.classStudentList.filter(
                    (e) => !studentIds.includes(e)
                );
            }

            if (this.classDetail.subjects.length == 0) {
                form.value['new_subject'] = [
                    form.value['subject']['subject_id']
                ];
                form.value['rem_subject'] = [];
            } else if (
                this.classDetail.subjects[0].subject_id !==
                form.value['subject']['subject_id']
            ) {
                form.value['new_subject'] = [
                    form.value['subject']['subject_id']
                ];
                form.value['rem_subject'] = [
                    this.classDetail.subjects[0].subject_id
                ];
            } else {
                form.value['new_subject'] = [];
                form.value['rem_subject'] = [];
            }

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

            if (!this.classDetail.parent_class_id) {
                form.value['parent_class_id'] =
                    form.value['parent_class']['parent_class_id'];
                delete form.value['parent_class'];

                form.value['new_grade'] = [form.value['grade']['grade_id']];
                form.value['rem_grade'] = this.classDetail.grade
                    .filter(
                        (e) => e.grade_id != form.value['grade']['grade_id']
                    )
                    .map((e) => e.grade_id);
                form.value['rem_subject'] = this.classDetail.subjects
                    .filter(
                        (e) =>
                            e.subject_id != form.value['subject']['subject_id']
                    )
                    .map((e) => e.subject_id);
                form.value['new_user_ids'] = [];
                form.value['remove_user_ids'] = [];
            } else {
                form.value['new_grade'] = [];
                form.value['rem_grade'] = [];
            }

            delete form.value['user_id'];
            delete form.value['subject'];
            delete form.value['grade'];
            delete form.value['days'];
            this.editClass(form.value);
        } else {
            form.value['subject'] = [form.value['subject']['subject_id']];
            form.value['grade'] = [form.value['grade']['grade_id']];
            form.value['teacher_ids'] = [form.value['user_id']['user_id']];
            form.value['student_ids'] = studentIds;
            form.value['parent_class_id'] =
                form.value['parent_class']['parent_class_id'];
            delete form.value['parent_class'];
            delete form.value['user_id'];
            this.addClass(form.value);
        }
    }
}
