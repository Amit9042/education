import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBaseComponent } from '@sharedModule/components';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    CommonRegexp,
    ValidationConstant,
    RoleMaster
} from '@sharedModule/constants';
import { UsersService } from '../../service';
import { Users, Role } from '../../models';
import { MaterialSubject, MaterialGrade } from '@sharedModule/models';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { forkJoin } from 'rxjs';
import { MaterialService } from '../../../material-module/service';

@Component({
    selector: 'app-edit-user-dialog',
    templateUrl: './edit-user-dialog.component.html',
    styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent extends FormBaseComponent
    implements OnInit {
    // Form Group variables
    editUserForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();
    roleMaster: RoleMaster;

    //Data variable
    subjectList: MaterialSubject[] = [];
    gradeList: MaterialGrade[] = [];
    currentUserId: number;
    providerId: number;
    userDetail: Users;
    roleList: Role[] = [];

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'grade.alias',
        searchKey: 'grade.alias',
        searchPlaceholderLabel: 'Search grade',
        selectPlaceholderLabel: 'Select grade',
        isRequired: false,
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

    constructor(
        _fb: FormBuilder,
        public dialogRef: MatDialogRef<EditUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _usersService: UsersService,
        private _materialService: MaterialService
    ) {
        super(_fb);
    }

    ngOnInit() {
        this.providerId = this.data['providerId'];
        this.currentUserId = this.data['userId'];
        this.roleList = this.data['roleList'];
        this.intialize();
        this.getUserDetail();
        this.getGradeAndSubData();
    }

    intialize = () => {
        this.createEditUserForm();
    };

    createEditUserForm = () => {
        this.editUserForm = this.createForm({
            first_name: [
                { value: '', disabled: true },
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            last_name: [
                { value: '', disabled: true },
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            email: [
                { value: '', disabled: true },
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(255),
                    Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)
                ]
            ],
            role: ['', [Validators.required]],
            grade: [''],
            subject: ['']
        });
    };

    onSubmitEditUserForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            form.value['role_id'] = form.value['role'];
            if (form.value['role_id'] == this.roleTeacher) {
                if (form.value['grade']) {
                    form.value['new_grade'] = form.value['grade']
                        .filter(e => {
                            return (
                                this.userDetail.grade.filter(v => {
                                    return v.grade_id == e.grade_id;
                                }).length == 0
                            );
                        })
                        .map(e => e.grade_id);
                    form.value['rem_grade'] = this.userDetail.grade
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
                                this.userDetail.subject.filter(v => {
                                    return v.subject_id == e.subject_id;
                                }).length == 0
                            );
                        })
                        .map(e => e.subject_id);
                    form.value['rem_subject'] = this.userDetail.subject
                        .filter(e => {
                            return (
                                form.value['subject'].filter(v => {
                                    return v.subject_id == e.subject_id;
                                }).length == 0
                            );
                        })
                        .map(e => e.subject_id);
                }
            }
            delete form.value['role'];
            delete form.value['subject'];
            delete form.value['grade'];
            delete form.value['gradeFilter'];
            delete form.value['subjectFilter'];
            this.updateUser(form.value);
        }
    };

    onDialogClose() {
        this.dialogRef.close();
    }

    get formControls() {
        return this.editUserForm.controls;
    }

    getUserDetail = () => {
        this._usersService.getDetails({}, this.currentUserId).subscribe(res => {
            this.userDetail = res['payload'];
            if(!this.userDetail['grade']){
                this.userDetail['grade'] = [];
            }
            if(!this.userDetail['subject']){
                this.userDetail['subject'] = [];
            }
            this.editUserForm.patchValue({
                first_name: this.userDetail.first_name,
                last_name: this.userDetail.last_name,
                email: this.userDetail.email,
                role: this.userDetail.user_role_link.role_id
            });
        });
    };

    updateUser = param => {
        this._usersService
            .updateUser(param, this.currentUserId)
            .subscribe(response => {
                this.dialogRef.close(true);
            });
    };

    onSelectChangeEvent(event, flag) {
        switch (flag) {
            case 'subject':
                this.formControls['subject'].setValue(event);
                break;
            case 'grade':
                this.formControls['grade'].setValue(event);
                break;
        }
    }

    get roleTeacher() {
        return RoleMaster.TEACHER;
    }

    getGradeAndSubData = () => {
        forkJoin([
            this._materialService.getGradeList({}),
            this._materialService.getSubList({})
        ]).subscribe(
            allResponses => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleSubjectList(allResponses[1]['payload']);
            },
            err => {
                console.log(err);
            }
        );
    };

    handleGradeList = gradeList => {
        this.gradeList = gradeList;
    };

    handleSubjectList = list => {
        this.subjectList = list;
    };
}
