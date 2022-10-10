import { FormBaseComponent } from './../../../../../../shared-module/components/form-base/form-base.component';
import { Component, OnInit, Inject } from '@angular/core';
import { ValidationConstant, CommonRegexp } from '@sharedModule/constants';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParentClassesService } from '../../service';
import { MaterialService } from '../../../material-module/service';
import { queryParamsFunction } from '@sharedModule/functions';
import { MaterialGrade, ParentClasses } from '@sharedModule/models';
import { SharedUserService } from '@sharedModule/services';
import { forkJoin, of } from 'rxjs';

@Component({
    selector: 'es-user-parent-classes-details-dialog',
    templateUrl: './parent-classes-details-dialog.component.html',
    styleUrls: ['./parent-classes-details-dialog.component.scss']
})
export class ParentClassesDetailsDialogComponent extends FormBaseComponent
    implements OnInit {
    // Constants variables
    validationMsg = new ValidationConstant();

    // Form group variables
    parentClassDetailsForm: FormGroup;

    // Data variables
    gradeList: MaterialGrade[] = [];
    selectedGrade: MaterialGrade;

    // Auto chips variables
    visible = true;
    selectable = true;
    removable = true;

    isEditMode = false;
    currentParentClassId: number;
    providerId: number;
    parentClassDetail: ParentClasses;

    // Select Search Variables
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

    constructor(
        fb: FormBuilder,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ParentClassesDetailsDialogComponent>,
        private _parentClassesService: ParentClassesService,
        private materialService: MaterialService,
        private _sharedUserService: SharedUserService
    ) {
        super(fb);
    }

    ngOnInit(): void {
        const config = this._sharedUserService.getUserConfig();
        this.providerId = config['provider_list'][0]['provider_id'];
        this.isEditMode = this.data['edit'];
        this.currentParentClassId = this.data['parentClassId'];
        this.createParentClassDetailsForm();
        this.getData();
    }

    createParentClassDetailsForm = () => {
        this.parentClassDetailsForm = this.createForm({
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
            grade: [
                '',
                [Validators.required]
            ]
        });
    };

    onSubmitParentClassDetailsForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            form.value['provider_id'] = this.providerId;
            form.value['class_name'] = form.value['name'];
            delete form.value['name'];
            delete form.value['gradeFilter'];
            if (this.isEditMode) {
                this.editClass(form.value);
            } else {
                form.value['grade_id'] = form.value['grade']['grade_id'];
                delete form.value['grade'];
                this.addClass(form.value);
            }
        }
    };

    onSelectChangeEvent(event, flag) {
        this.formControls[flag].setValue(event);
    }

    get formControls() {
        return this.parentClassDetailsForm.controls;
    }

    onCloseDialog(flag: boolean): void {
        this.dialogRef.close(flag);
    }

    getData = () => {
        forkJoin([
            this.materialService.getGradeList(
                queryParamsFunction({}, null, 1, 100, true)
            ),
            this.isEditMode
                ? this._parentClassesService.getParentClassDetails(
                      this.currentParentClassId
                  )
                : of([])
        ]).subscribe(allResponses => {
            this.handleGradeList(allResponses[0]['payload']);
            if (this.isEditMode) {
                this.handelParentClassDetail(allResponses[1]);
            }
        });
    };

    handleGradeList = list => {
        this.gradeList = list;
        this.gradeList.map(e => {
            e.name = e.grade.alias;
        });
    };

    addClass = param => {
        this._parentClassesService.addParentClass(param).subscribe(response => {
            this.onCloseDialog(true);
        });
    };

    editClass = param => {
        this._parentClassesService
            .editParentClass(param, this.currentParentClassId)
            .subscribe(response => {
                this.onCloseDialog(true);
            });
    };

    handelParentClassDetail = response => {
        this.parentClassDetail = response['payload'];
        this.parentClassDetailsForm.patchValue({
            name: this.parentClassDetail.class_name
        });
        this.selectedGrade = this.gradeList.find(
            e => e.grade_id == this.parentClassDetail.grade_id
        );
        this.parentClassDetailsForm.controls['grade'].disable();
    };
}
