import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import { ValidationConstant } from '@sharedModule/constants';
import { ClassesService } from '../../../classes-module/service';
import { EnrolmentRequestService } from '../../services';
import { GradeListModel } from '../../../../../../public-modules/models/provider';
import { Classes, ParentClasses } from '@sharedModule/models';
import { StudentEnrolReqModel } from '../../../../../models';
import { Provider } from '../../../../../../public-modules/models';
import { ParentClassesService } from '../../../parent-classes-module/service';
import { getQueryParams } from '@sharedModule/functions';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';

@Component({
    selector: 'app-assign-enrollment-request-dialog',
    templateUrl: './assign-enrollment-request-dialog.component.html',
    styleUrls: ['./assign-enrollment-request-dialog.component.scss']
})
export class AssignEnrollmentRequestDialogComponent extends FormBaseComponent
    implements OnInit {
    assignEnrollmentForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();
    enrllDetail: StudentEnrolReqModel = null;
    provider: Provider = null;

    // Datasourse Variables
    gradelist: GradeListModel[] = [];
    // classList: Classes[] = [];
    parentClassList: ParentClasses[] = [];
    // gradeList: any = [];

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'alias',
        searchKey: 'alias',
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
        selectMulti: true,
        selectedValueCompairId: 'parent_class_id',
        validationMsg: this.validationMsg.CLASS
    };

    constructor(
        _fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AssignEnrollmentRequestDialogComponent>,
        protected classService: ClassesService,
        protected enrolReqService: EnrolmentRequestService,
        private _parentClassesService: ParentClassesService
    ) {
        super(_fb);
    }

    ngOnInit() {
        this.initalize();
    }

    initalize = () => {
        this.enrllDetail = this.data.enrllDetail;
        this.provider = this.data.provider;
        this.createAssignEnrollmentForm();
        this.getGradeList();
    };

    createAssignEnrollmentForm = () => {
        this.assignEnrollmentForm = this.createForm({
            request_id: [this.enrllDetail.request_id],
            parent_class: ['', [Validators.required]],
            grade: ['', [Validators.required]],
            assign_session: ['true'],
        });
    };

    getGradeList() {
        const params = { provider_id: this.provider.provider_id };
        this.enrolReqService.enrollStuGradeList(params).subscribe(response => {
            this.gradelist = response.payload;
        });
    }

    // getClassList(event: any) {
    //     const params = {
    //         provider_id: this.provider.provider_id,
    //         grade_ids: [event.value]
    //     };
    //     this.enrolReqService.enrollStuClassList(params).subscribe(response => {
    //         this.classList = response.payload;
    //     });
    // }

    onSubmitAssignEnrollmentForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            form.value['parent_class_ids'] = form.value['parent_class'].map(
                e => {
                    return e.parent_class_id;
                }
            );
            delete form.value['grade'];
            delete form.value['parentFilter'];
            delete form.value['gradeFilter'];
            const params = form.value;
            this.classService.assignParentClass(params).subscribe(response => {
                this.onCloseDialog(true);
            });
        }
    };

    onCloseDialog(flag: boolean): void {
        this.dialogRef.close(flag);
    }

    // Helpers
    get formControls() {
        return this.assignEnrollmentForm.controls;
    }

    getParentClassList = (event: any) => {
        this._parentClassesService
            .listParentClass({
                provider_id: this.provider.provider_id,
                ...getQueryParams(
                    { is_active: 1, grade_id: event['grade_id'] },
                    null,
                    1,
                    100,
                    true
                )
            })
            .subscribe(res => {
                this.parentClassList = res['payload'];
            });
    };

    onSelectChangeEvent(event, flag) {
        if (flag === 'grade') {
            this.getParentClassList(event);
        }
        this.formControls[flag].setValue(event);
    }
}
