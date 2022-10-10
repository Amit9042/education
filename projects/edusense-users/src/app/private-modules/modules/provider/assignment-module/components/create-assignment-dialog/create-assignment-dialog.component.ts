import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBaseComponent } from '@sharedModule/components';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import {
    ALLOWED_MATERIAL_FILE_TYPES,
    CommonRegexp,
    FileSizeEnum,
    ValidationConstant
} from '@sharedModule/constants';
import { removeEmptyFields } from '@sharedModule/functions';
import { AssignmentDetailModel, Classes } from '@sharedModule/models';
import { SharedService } from '@sharedModule/services';
import * as moment from 'moment';
import { AssignmentListService } from '../../services';

@Component({
    selector: 'es-user-create-assignment-dialog',
    templateUrl: './create-assignment-dialog.component.html',
    styleUrls: ['./create-assignment-dialog.component.scss']
})
export class CreateAssignmentDialogComponent
    extends FormBaseComponent
    implements OnInit {
    // Form group variables
    myControl = new FormControl();
    createAssignmentForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();
    fileType = ALLOWED_MATERIAL_FILE_TYPES;

    // Data variables
    classList: Classes[] = [];
    selectedClass: Classes;
    classSearchConfig: SelectSearchModel = {
        displayLabel: 'Session',
        controlName: 'classFilterField',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search session',
        selectPlaceholderLabel: 'Select session',
        isRequired: true,
        validationMsg: this.validationMsg.SESSION,
        selectMulti: false,
        selectedValueCompairId: 'class_id'
    };
    currentDate = new Date();
    materialArray: any[] = [];
    removeAttachment: number[] = [];
    assignment: AssignmentDetailModel;

    constructor(
        fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CreateAssignmentDialogComponent>,
        private sharedService: SharedService,
        private assignmentListService: AssignmentListService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    // Initialisation methods
    initialize = () => {
        this.classList = this.data.classList;
        if (this.data['assignment']) {
            this.assignment = this.data['assignment'];
            this.assignment.provider_assignment_attachments.forEach(
                (record) => {
                    this.materialArray.push({
                        attachmentId: record.attachment_id,
                        files: record.file_path,
                        name: record.file_name,
                        extension: record.file_content_type,
                        isAttached: true
                    });
                }
            );
            this.selectedClass = this.classList.find(
                (e) => this.assignment.class.class_id === e.class_id
            );
        }
        this.createCreateAssignmentForm();
    };

    createCreateAssignmentForm = () => {
        this.createAssignmentForm = this.createForm({
            title: [
                this.assignment ? this.assignment.title : '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            instructions: [
                this.assignment ? this.assignment.instruction : '',
                [
                    Validators.minLength(2),
                    Validators.maxLength(1000),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            classFilterField: [],
            classId: [this.assignment ? this.assignment.class.class_id : ''],
            startDate: [
                this.assignment ? this.assignment.start_date : '',
                [Validators.required]
            ],
            submissionDate: [
                this.assignment ? this.assignment.submission_date : '',
                [Validators.required]
            ]
        });
    };

    // Api calls
    createAssignment = (params: any) => {
        return this.assignmentListService.createAssignment(params);
    };

    UpdateAssignment = (params: any) => {
        return this.assignmentListService.updateAssignment(
            this.assignment.assignment_id,
            params
        );
    };

    uploadAssignmentFileApiCall = (file: any[]) => {
        return this.assignmentListService.uploadAssignmentFile(file);
    };

    removeAssignmentFileApiCall = (id: number) => {
        return this.assignmentListService.removeAssignmentFile(id);
    };

    // Page events
    onSubmitCreateAssignmentForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            if (form.value['startDate']) {
                form.value['startDate'] = moment(
                    new Date(form.value['startDate'])
                ).format('YYYY-MM-DD');
            }
            if (form.value['submissionDate']) {
                form.value['submissionDate'] = moment(
                    new Date(form.value['submissionDate'])
                ).format('YYYY-MM-DD');
            }

            if (this.assignment) {
                form.value['removeAttachmentId'] = this.removeAttachment;
                form.value['attachmentId'] = this.materialArray
                    .filter((record) => record.isAttached === false)
                    .map((record) => record.attachmentId);
            } else {
                form.value['attachmentId'] = this.materialArray.map(
                    (record) => record.attachmentId
                );
            }
            const params = removeEmptyFields(form.value);
            if (this.assignment) {
                this.UpdateAssignment(params).subscribe(() => {
                    this.onCloseDialog(true);
                });
            } else {
                this.createAssignment(params).subscribe(() => {
                    this.onCloseDialog(true);
                });
            }
        }
    };

    onSelectChangeEvent = (event, type) => {
        this.formControls[type].setValue(event.class_id);
    };

    onFileUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validType = !this.fileType.find((e1) => e1.name == file.type);
            if (validType) {
                this.sharedService.setSnackBar(
                    `Unsupported File ${file['name']}. Please select valid type`
                );
            } else {
                if (
                    event.target.files[0].size >
                    FileSizeEnum.TWO_HUNDRED_MB_IMAGE_SIZE
                ) {
                    this.sharedService.setSnackBar(
                        this.validationMsg.VALID_TWO_HUNDRED_MB_FILE_SIZE
                    );
                } else {
                    const reader = new FileReader();
                    reader.onloadend = (loadEvent: any) => {
                        let imagePath = loadEvent.target.result;
                        const image = new Image();
                        image.src = imagePath;
                        let array = [
                            {
                                reqKey: 'attachment',
                                files: event.target.files,
                                name: file.name
                            }
                        ];
                        this.uploadAssignmentFileApiCall(array).subscribe(
                            (response) => {
                                this.materialArray.push({
                                    attachmentId:
                                        response['payload']['data'][
                                            'attachment_id'
                                        ],
                                    files: event.target.files,
                                    name:
                                        response['payload']['data'][
                                            'file_name'
                                        ],
                                    extension:
                                        response['payload']['data'][
                                            'file_content_type'
                                        ],
                                    isAttached: false
                                });
                            }
                        );
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    onRemoveFile = (id: number, isAttached: boolean) => {
        if (this.assignment && isAttached === true) {
            this.removeAttachment.push(id);
            this.removeFileFromArray(id);
        } else {
            this.removeAssignmentFileApiCall(id).subscribe(() => {
                this.removeFileFromArray(id);
            });
        }
    };

    removeFileFromArray = (id) => {
        let index = this.materialArray.findIndex(
            (fileObj) => fileObj.attachmentId === id
        );
        if (index !== -1) {
            this.materialArray.splice(index, 1);
        }
    };

    getIcon = (extension: string) => {
        let icon = this.fileType
            .filter((e) => e.name == extension)
            .map((e) => e.icon)[0];
        return icon ? icon : 'defaultMaterial';
    };

    onBrowseFile(id) {
        if (this.materialArray.length < 10) {
            document.getElementById(id).click();
        } else {
            this.sharedService.setSnackBar(
                this.validationMsg.MAXIMUM_ATTACHMENTS
            );
        }
    }

    onCloseDialog(flag: boolean) {
        this.dialogRef.close(flag);
    }

    // Helpers
    get formControls() {
        return this.createAssignmentForm.controls;
    }

    clearValue = (event) => {
        event.target.value = null;
    };
}
