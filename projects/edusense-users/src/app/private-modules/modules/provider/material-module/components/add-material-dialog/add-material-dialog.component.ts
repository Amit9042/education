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
    MATERIAL_TYPE
} from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
    MatAutocompleteSelectedEvent,
    MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Grade, Medium, MaterialGrade } from '@sharedModule/models';
import { getQueryParams, bytesToSizeInMB } from '@sharedModule/functions';
import { ClassesService } from '../../../classes-module/service';
import { MaterialService } from '../../service';
import {
    ALLOWED_MATERIAL_FILE_TYPES,
    FILE_SIZE_ALLOWED
} from '@sharedModule/constants';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { SubjectListModel } from '../../../../../../public-modules/models/provider';
import { Material } from '../../models/material.model';

@Component({
    selector: 'app-add-material-dialog',
    templateUrl: './add-material-dialog.component.html',
    styleUrls: ['./add-material-dialog.component.scss']
})
export class AddMaterialDialogComponent extends FormBaseComponent
    implements OnInit {
    @Input() dropdownData: any;

    @ViewChild('subjectInput') subjectInput: ElementRef<HTMLInputElement>;

    @ViewChild('gradeInput') gradeInput: ElementRef<HTMLInputElement>;

    // Form group variables
    addMaterialForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();
    fileType = ALLOWED_MATERIAL_FILE_TYPES;
    fileSizeAllowed = FILE_SIZE_ALLOWED;
    materialType = MATERIAL_TYPE;

    //Data variable
    gradeList: Grade[] = [];
    subjectList: SubjectListModel[] = [];
    uploadMaterialFile = [];
    currentMaterialId: number;
    curruntMaterial: Material;
    isEditMode: boolean = false;
    selectedGrades: Grade;
    selectedSubjects: SubjectListModel;
    selectedGradeAndSubject;

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'alias',
        searchKey: 'alias',
        searchPlaceholderLabel: 'Search grade',
        selectPlaceholderLabel: 'Select grade',
        isRequired: true,
        validationMsg: this.validationMsg.GRADE,
        isDisabled: true
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
        validationMsg: this.validationMsg.SUBJECT,
        isDisabled: true
    };

    filterTypeShow;

    constructor(
        fb: FormBuilder,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddMaterialDialogComponent>,
        private _classesService: ClassesService,
        private _materialService: MaterialService,
        private sharedService: SharedService,
        private _sharedUserService: SharedUserService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.currentMaterialId = this.data['materialId'];
        this.filterTypeShow =
            'Allowed file type list \n\n' +
            this.data['filterTypeShow'].join(' ');
        if (this.currentMaterialId) {
            this.isEditMode = true;
            this.detailMaterial();
        } else {
            this.selectedGradeAndSubject = this._materialService.getMaterialFilterData();
            this.getData();
        }
        this.initialize();
    }

    initialize = () => {
        this.createAddMaterialForm();
    };

    createAddMaterialForm = () => {
        this.addMaterialForm = this.createForm({
            name: ['', [Validators.required]],
            grade: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            material_type_id: [1],
            file_path: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.LINK_REGEXP)
                ]
            ]
        });
        this.formControls['file_path'].disable();
        if (!this.isEditMode) {
            this.formControls['name'].disable();
        } else {
            this.formControls['material_type_id'].disable();
        }
    };

    onSubmitAddMaterialForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const rawValue = form.getRawValue();
            if (rawValue['material_type_id'] == this.materialType.File) {
                if (this.uploadMaterialFile.length <= 0) {
                    this.sharedService.setSnackBar('Material is required');
                    return;
                }
            }
            if (rawValue['grade']) {
                rawValue['grade_id'] = rawValue['grade'].grade_id;
            }
            delete rawValue['grade'];
            if (rawValue['subject']) {
                rawValue['subject_id'] = rawValue['subject'].subject_id;
            }
            delete rawValue['subject'];
            delete rawValue['filterCtl'];
            delete rawValue['gradeFilter'];
            delete rawValue['subjectFilter'];
            rawValue['material_type_id'] = '' + rawValue['material_type_id'];
            if (this.isEditMode) {
                this.editMaterial(rawValue);
            } else {
                this.addMaterial(rawValue);
            }
        }
    };

    // Helpers
    get formControls() {
        return this.addMaterialForm.controls;
    }

    onCloseDialog(flag: boolean): void {
        this.dialogRef.close(flag);
    }

    onFileUpload = event => {
        if (event.target.files && event.target.files.length < 10) {
            const files = [...event.target.files];
            const validType = files.filter(
                e => !this.fileType.find(e1 => e1.name == e.type)
            );
            if (validType.length <= 0) {
                const maxAllowedSize = 1024;
                const fileSize = files.filter(
                    e => bytesToSizeInMB(e.size) > maxAllowedSize
                );
                if (fileSize.length > 0) {
                    fileSize.forEach((e, i) => {
                        this.sharedService.setSnackBar(
                            `Unsupported File '${e['name']}'. Max file size allowed ${maxAllowedSize} mb`
                        );
                    });
                    return;
                }
                this.uploadMaterialFile = [
                    {
                        reqKey: 'material',
                        files: files
                    }
                ];
            } else {
                validType.forEach((e, i) => {
                    this.sharedService.setSnackBar(
                        `Unsupported File ${e['name']}. Please select valid type`
                    );
                });
            }
        } else {
            this.sharedService.setSnackBar(
                'Max 10 files allowed to upload in one request'
            );
        }
        event.target.value = null;
    };

    onBrowseFile(id) {
        document.getElementById(id).click();
    }

    getData = () => {
        forkJoin([
            this._classesService.getGradeList(
                getQueryParams({}, null, 1, 100, true)
            ),
            this._classesService.getSubjectList(
                getQueryParams({}, null, 1, 100, true)
            )
        ]).subscribe(
            allResponses => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleSubjectList(allResponses[1]['payload']);
                this.selected();
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

    selected = () => {
        if (this.isEditMode) {
            this.subjectList.forEach(item => {
                if (item.subject_id === this.curruntMaterial.subject_id) {
                    this.selectedSubjects = item;
                }
            });
            this.gradeList.forEach(item => {
                if (item.grade_id === this.curruntMaterial.grade_id) {
                    this.selectedGrades = item;
                }
            });
        } else {
            this.subjectList.forEach(item => {
                if (
                    item.subject_id === this.selectedGradeAndSubject.subject_id
                ) {
                    this.selectedSubjects = item;
                }
            });
            this.gradeList.forEach(item => {
                if (item.grade_id === this.selectedGradeAndSubject.grade_id) {
                    this.selectedGrades = item;
                }
            });
        }
    };

    addMaterial = param => {
        if (
            this.uploadMaterialFile.length > 0 &&
            this.uploadMaterialFile[0].reqKey
        ) {
            // this._materialService
            //     .addMaterialFile(param, this.uploadMaterialFile)
            //     .subscribe(response => {
            //         this.onCloseDialog(true);
            //     });
            this._sharedUserService.setMaterialUpload({
                param: param,
                materialFile: this.uploadMaterialFile,
                isMaterial: true
            });
            this.sharedService.setSnackBar(
                'Material Uploading Started in Background'
            );
            this.onCloseDialog(false);
        } else {
            this._materialService.addMaterial(param).subscribe(response => {
                this.onCloseDialog(true);
            });
        }
    };

    detailMaterial = () => {
        this._materialService
            .getMaterialDetails(this.currentMaterialId)
            .subscribe(response => {
                this.curruntMaterial = response['payload'];
                this.handleDetailResponse();
                this.getData();
            });
    };

    onMaterialTypeChange(event) {
        if (event.value === 2) {
            this.formControls['file_path'].enable();
            this.formControls['name'].enable();
        } else {
            if (!this.isEditMode) {
                this.formControls['name'].disable();
            }
            this.formControls['file_path'].disable();
        }
    }

    handleDetailResponse = () => {
        this.addMaterialForm.patchValue({
            name: this.curruntMaterial.name,
            material_type_id: this.curruntMaterial.material_type_id
        });
        if (
            this.curruntMaterial.material_type_id == this.materialType.Youtube
        ) {
            this.formControls['file_path'].enable();
            this.addMaterialForm.patchValue({
                file_path: this.curruntMaterial.file_path
            });
        } else {
            this.uploadMaterialFile = [
                {
                    files: [
                        {
                            name: this.curruntMaterial.original_file_name,
                            type: this.curruntMaterial.file_content_type
                        }
                    ]
                }
            ];
        }
    };

    editMaterial = param => {
        if (
            this.uploadMaterialFile.length > 0 &&
            this.uploadMaterialFile[0].reqKey
        ) {
            param['is_material_change'] = 'true';
            this._materialService
                .updateMaterialFile(
                    param,
                    this.uploadMaterialFile,
                    this.currentMaterialId
                )
                .subscribe(response => {
                    this.onCloseDialog(true);
                });
        } else {
            if (
                param['file_path'] &&
                param['file_path'] != this.curruntMaterial.file_path
            ) {
                param['is_material_change'] = 'true';
            }
            this._materialService
                .updateMaterial(param, this.currentMaterialId)
                .subscribe(response => {
                    this.onCloseDialog(true);
                });
        }
    };

    getFileIcon = type => {
        return this.fileType.filter(e => e.name == type).map(e => e.icon)[0];
    };

    onSelectChangeEvent = (event, type) => {
        switch (type) {
            case 'subject':
                this.formControls[type].setValue(event);
                break;
            case 'grade':
                this.formControls[type].setValue(event);
                break;
        }
    };

    removeFiles = i => {
        this.uploadMaterialFile[0].files.splice(i, 1);
        if (this.uploadMaterialFile[0].files.length == 0) {
            this.uploadMaterialFile = [];
        }
    };
}
