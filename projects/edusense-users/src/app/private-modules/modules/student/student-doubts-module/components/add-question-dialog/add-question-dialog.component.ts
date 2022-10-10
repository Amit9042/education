import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray
} from '@angular/forms';
import {
    ValidationConstant,
    CommonRegexp,
    RouteConstant,
    FileSizeEnum,
    AppMessageConstants
} from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { SharedService } from '@sharedModule/services';
import { getQueryParams, isValidImageType } from '@sharedModule/functions';
import { StudentQuePreviewDialogComponent } from '../student-que-preview-dialog/student-que-preview-dialog.component';
import { Router } from '@angular/router';
import { AskQuestionService } from '../../services';
import { forkJoin } from 'rxjs';
import { GradeList, TeacherDetail } from '../../models';

@Component({
    selector: 'es-user-add-question-dialog',
    templateUrl: './add-question-dialog.component.html',
    styleUrls: ['./add-question-dialog.component.scss']
})
export class AddQuestionDialogComponent extends FormBaseComponent
    implements OnInit {
    @Input() dropdownData: any;

    // Form group variables
    myControl = new FormControl();
    askQuestionForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    //Data variable
    gradeList: GradeList[] = [];
    teacherList: TeacherDetail[] = [];
    selectedGrades;
    selectedTeachers;
    configData;
    subjectName: string;
    providerId: number;
    uploadedImage = [];
    selectedImage = [];
    imageUploadDetails;
    askedUserId: number;
    gradeId: number;
    subjectId: number;
    providerUUID: string;

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search grade',
        selectPlaceholderLabel: 'Select grade',
        isRequired: true,
        validationMsg: this.validationMsg.GRADE,
        isDisabled: false,
        selectedValueCompairId: 'name'
    };

    teacherSearchConfig: SelectSearchModel = {
        displayLabel: 'Teacher',
        controlName: 'teacher',
        filterControlName: 'teacherFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search teacher',
        selectPlaceholderLabel: 'Select teacher',
        isRequired: true,
        validationMsg: this.validationMsg.TEACHER_NAME,
        isDisabled: false,
        selectedValueCompairId: 'name'
    };

    constructor(
        fb: FormBuilder,
        public dialogRef: MatDialogRef<AddQuestionDialogComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router: Router,
        private askQuestionService: AskQuestionService,
        private sharedService: SharedService
    ) {
        super(fb);
    }

    ngOnInit(): void {
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
        if (this.data.subject) {
            this.subjectName = this.data.subject.subject_master ? this.data.subject.subject_master.name : this.data.subject.subject.subject_master.name;
            this.subjectId = this.data.subject.subject_master ? this.data.subject.subject_id : this.data.subject.subject.subject_id;
        } else if (this.data.detail) {
            this.subjectName = this.data.detail.subject_id ? this.data.detail.subject_id.name : this.data.detail.subject.name;
            this.subjectId = this.data.detail.subject_id ? this.data.detail.subject_id.subject_id : this.data.detail.subject.subject_id;
        }
        this.configData = this.sharedService.getUserConfig();
        this.gradeId = this.configData.studentObj.grade_id;
        this.initialize();
        this.getData();
    }

    getData = () => {
        const params = getQueryParams({}, null, 1, 100, true);
        params['providerUUID'] = this.providerUUID;
        forkJoin([
            this.askQuestionService.getGradeList(params),
            this.askQuestionService.getTeacherList(params)
        ]).subscribe(
            allResponses => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleTeacherList(allResponses[1]['payload']);
                this.selectedGradeTeacher(this.gradeId);
            },
            err => {
                console.log(err);
            }
        );
    }

    initialize = () => {
        this.createAskQuestionForm();
        if (this.data?.detail && this.data?.detail.isEdit) {
            this.patchAskQuestionFormValue();
        } else if (this.data.subject.subject) {
            this.patchAskQuestionFormValue();
        }
    };

    createAskQuestionForm = () => {
        this.askQuestionForm = this.createForm({
            question: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(255)
                ]
            ],
            description: [
                '',
                [
                    Validators.minLength(2),
                    Validators.maxLength(1000)
                ]
            ],
            grade: ['', [Validators.required]],
            teacher: ['', [Validators.required]],
            imageDesc: this.fb.array([])
        });
    };

    handleGradeList = gradeData => {
        gradeData.forEach(elem => {
            elem.class_grade_list.forEach(item => {
                const index = this.gradeList.findIndex(
                    e => e.grade_id == item.grade_id
                );
                if (index < 0) {
                    this.gradeList.push(item);
                }
            })
        })
        this.gradeList.map(elem => {
            elem['name'] = elem['grade_master']['alias'];
        });
        // this.gradeList.sort(function(a, b){return a.grade_id - b.grade_id});
    };

    handleTeacherList = list => {
        list.forEach(elem => {
            elem.class_user_link.forEach(item => {
                const index = this.teacherList.findIndex(
                    e => e.user_id == item.user_id
                );
                if (index < 0) {
                    item['provider_id'] = elem.student_class_detail.provider_id;
                    item['name'] = item.user_master_detail?.first_name + ' ' + item.user_master_detail?.last_name;
                    this.teacherList.push(item);
                } 
            })
        })
    };

    selectedGradeTeacher = (gradeId) => {
        if (this.data.detail && this.data.detail.isEdit) {
            const grades = this.data.detail.grade_id ? this.data.detail.grade_id : this.data.detail.grade;
            this.gradeList.forEach(item => {
                if (item.grade_id === grades.grade_id) {
                    this.selectedGrades = item;
                    this.selectedGrades['name'] = item['grade_master']['alias'];
                }
            });
            const teachers = this.data.detail.asked_user_obj ? this.data.detail.asked_user_obj : this.data.detail.teacher;
            this.teacherList.forEach(item => {
                if (item.user_id === teachers.user_id) {
                    this.selectedTeachers = item;
                    this.selectedTeachers['name'] = teachers.name ? teachers.name : teachers.first_name + ' ' + teachers.last_name;
                }
            })
            if (this.data.detail.provider_id) {
                this.providerId = this.data.detail.provider_id;
            }
            if (this.data.detail.asked_user_id) {
                this.askedUserId = this.data.detail.asked_user_id;
            }
        } else if (this.data.subject && this.data.subject.grade) {
            const grades = this.data.subject.grade;
            this.gradeList.forEach(item => {
                if (item.grade_id === grades.grade_id) {
                    this.selectedGrades = item;
                    this.selectedGrades['name'] = item['grade_master']['alias'];
                }
            });
            const teachers = this.data.subject.teacher;
            if (teachers.provider_id) {
                this.providerId = teachers.provider_id;
            }
            this.teacherList.forEach(item => {
                if (item.user_id === teachers.user_id) {
                    this.selectedTeachers = item;
                    this.selectedTeachers['name'] = teachers.name ? teachers.name : teachers.first_name + ' ' + teachers.last_name;
                }
            })
        } else {
            this.gradeList.forEach(item => {
                if (item.grade_id === gradeId) {
                    this.selectedGrades = item;
                    this.selectedGrades['name'] = item['grade_master']['alias'];
                }
            });
            this.selectedTeachers = '';
        }
    };

    onFileUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            if (this.uploadedImage.length < 5) {
                const file = event.target.files[0];
                if (isValidImageType(event.target.files[0].type)) {
                    if (
                        event.target.files[0].size > FileSizeEnum.FIVE_MB_IMAGE_SIZE
                    ) {
                        this.sharedService.setSnackBar(AppMessageConstants.FILE_SIZE_GREATER_THEN_FIVE_MB);
                        event.target.value = null;
                    } else {
                        const reader = new FileReader();
                        reader.onloadend = (loadEvent: any) => {
                            const that = this;
                            this.imageUploadDetails = loadEvent.target.result;
                            const image = [{
                                reqKey: 'image',
                                files: event.target.files
                            }];
                            
                            const img = new Image();
                            img.src = this.imageUploadDetails;
                            img.onload = function(){
                                that.askQuestionService.fileUpload(image).subscribe(response =>{
                                    that.selectedImage.push(image[0]);
                                    (<FormArray>that.askQuestionForm.controls.imageDesc).push(new FormControl('', Validators.maxLength(255)));
                                    that.uploadedImage.push({
                                        'url': `${response.payload.baseUrl}${response.payload.imageUrl}`,
                                        'resolution': `${img.height}X${img.width}`
                                    });
                                })
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                } else {
                    this.sharedService.setSnackBar(AppMessageConstants.FILE_TYPE_ERROR);
                    event.target.value = null;
                }
            } else {
                this.sharedService.setSnackBar(AppMessageConstants.FIVE_IMAGES_ALLOWED);
                event.target.value = null;
            }
        }
    };

    onRemoveImage = (index) => {
        this.selectedImage.splice(index, 1);
        this.uploadedImage.splice(index, 1);
        (<FormArray>this.askQuestionForm.controls.imageDesc).removeAt(index);
    }

    onBrowseFile(id) {
        document.getElementById(id).click();
    }

    onQuestionAnswer = (questionId) => {
        this.onCloseDialog();
        this.router.navigate(['/' + RouteConstant.STUDENT_QUESTION_ANSWER, questionId]);
    };

    onPreviewQuestion() {
        const data = this.askQuestionForm.value;
        data['subject'] = this.data.subject ? 
                this.data.subject.subject_master ? this.data.subject : this.data.subject.subject
                : this.data.detail.subject ? this.data.detail.subject : this.data.detail.subject_id;
        if (this.uploadedImage.length) {
            const imageDescControl = <FormArray>this.askQuestionForm.controls.imageDesc;
            for (let i = 0; i < this.selectedImage.length ; i++) {
                this.uploadedImage[i]['description'] = imageDescControl.controls[i].value;
            }
            data['uploadedImages'] = this.uploadedImage;
            data['imageData'] = this.selectedImage;
        }
        this.onCloseDialog(data);
    }

    patchAskQuestionFormValue = () => {
        this.askQuestionForm.patchValue({
            question: this.data.detail ? this.data?.detail.question : this.data.subject.question,
            description: this.data.detail ? this.data?.detail.description : this.data.subject.description
        });
        if (this.data.subject) {
            if (this.data.subject.uploadedImages) {
                this.data.subject.uploadedImages.forEach(element => {
                    (<FormArray>this.askQuestionForm.controls.imageDesc).push(new FormControl(element.description, Validators.maxLength(255)));
                    this.uploadedImage.push({
                        'url': element.url,
                        'resolution': element.resolution,
                        'description': element.description
                    });
                });
            }
            this.selectedImage = this.data.subject.imageData ? this.data.subject.imageData : [];
        } else if (this.data.detail && this.data.detail.uploadedImages) {
            this.data.detail.uploadedImages.forEach(element => {
                (<FormArray>this.askQuestionForm.controls.imageDesc).push(new FormControl(element.description, Validators.maxLength(255)));
                this.uploadedImage.push({
                    'url': element.url,
                    'resolution': element.resolution,
                    'description': element.description
                });
                if (this.data.detail.imageData) {
                    this.selectedImage = this.data.detail.imageData;
                } else {
                    const file = [];
                    const filename = element.url.split('/').pop();
                    file.push({'name': filename})
                    this.selectedImage.push({
                        files : file
                    })
                }
            });
        } else {
            if (this.data.detail.images) {
                this.data.detail.images.forEach(element => {
                    (<FormArray>this.askQuestionForm.controls.imageDesc).push(new FormControl(element.description, Validators.maxLength(255)));
                    this.uploadedImage.push({
                        'url': element.url,
                        'resolution': element.resolution
                    });
                    const file = [];
                    const filename = element.url.split('/').pop();
                    file.push({'name': filename})
                    this.selectedImage.push({
                        files : file
                    })
                });
            }
        }
    }

    onSelectChangeEvent = (event, type) => {
        switch (type) {
            case 'grade':
                this.gradeId = event.grade_id;
            case 'teacher':
                this.providerId = event.provider_id;
                this.askedUserId = event.user_id;
                break;
        }
    };

    onSubmitAskQuestionForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const params = this.prepareRequestData(form.value);
            params['providerUUID'] = this.providerUUID;
            if (this.data.detail && this.data.detail.isEdit) {
                const questionId = this.data?.detail._id;
                this.updateQuestion(params, questionId);
            } else {
                this.addQuestion(params);
            }
            
        }
    };

    addQuestion = (params) => {
        this.askQuestionService.askQuestion(params).subscribe(response => {
            this.onQuestionAnswer(response.payload._id);
        })
    }

    updateQuestion = (params, questionId) => {
        this.askQuestionService.updateQuestion(params, questionId).subscribe(response => {
            this.onQuestionAnswer(response.payload._id);
            // this.onCloseDialog(response.payload);
        })
    }

    prepareRequestData = (questionData, imageData?) => {
        questionData['provider_id'] = this.providerId ? this.providerId : 
            this.data.detail ? this.data.detail.teacher.provider_id : this.data.subject.teacher.user_master_detail.provider_id;
        questionData['subject_id'] = this.subjectId;
        questionData['grade_id'] = this.gradeId;
        questionData['asked_user_id'] = this.askedUserId ? this.askedUserId : 
            this.data.detail ? this.data.detail.teacher.user_id : this.data.subject.teacher.user_id;

        if (questionData['description'] === '') {
            delete(questionData['description']);
        }
        if (this.uploadedImage.length) {
            const imageDescControl = <FormArray>this.askQuestionForm.controls.imageDesc;
            for (let i = 0; i < this.selectedImage.length ; i++) {
                this.uploadedImage[i]['description'] = imageDescControl.controls[i].value;
            }
            questionData['images'] = this.uploadedImage;
        } else {
            questionData['images'] = [];
        }

        delete(questionData['grade']);
        delete(questionData['teacher']);
        delete(questionData['gradeFilter']);
        delete(questionData['teacherFilter']);
        delete(questionData['imageDesc']);

        return questionData;
    }

    onCloseDialog(questionData?) {
        this.dialogRef.close(questionData);
    }

    // Helpers
    get formControls() {
        return this.askQuestionForm.controls;
    }

    get imageDescFormArray() {
        return this.askQuestionForm.get("imageDesc") as FormArray;
    }
}
