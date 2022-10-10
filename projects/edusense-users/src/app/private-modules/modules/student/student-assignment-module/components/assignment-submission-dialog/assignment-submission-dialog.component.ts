import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
    ALLOWED_MATERIAL_FILE_TYPES,
    FileSizeEnum,
    ValidationConstant
} from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import { StudentAssignmentService } from '../../services';
import { removeEmptyFields } from '@sharedModule/functions';
import { AssignmentDetailModel } from '@sharedModule/models';
import { EnterpriseDetail } from '../../../../../../public-modules/models';

@Component({
    selector: 'es-user-assignment-submission-dialog',
    templateUrl: './assignment-submission-dialog.component.html',
    styleUrls: ['./assignment-submission-dialog.component.scss']
})
export class AssignmentSubmissionDialogComponent extends FormBaseComponent
    implements OnInit {
    // Form group variables
    myControl = new FormControl();
    submitAssignmentForm: FormGroup;

    // Data variables
    materialArray: any[] = [];
    assignmentDetail: AssignmentDetailModel;
    activeEnterprise: EnterpriseDetail;

    // Constants variables
    validationMsg = new ValidationConstant();
    fileType = ALLOWED_MATERIAL_FILE_TYPES;

    constructor(
        fb: FormBuilder,
        public dialogRef: MatDialogRef<AssignmentSubmissionDialogComponent>,
        private sharedService: SharedService,
        private studentAssignmentService: StudentAssignmentService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    // Initialization method
    initialize = () => {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.assignmentDetail = this.data['assignmentDetail'];
        this.createSubmitAssignmentForm();
    };

    createSubmitAssignmentForm = () => {
        this.submitAssignmentForm = this.createForm({
            description: [
                '',
                [Validators.minLength(2), Validators.maxLength(1000)]
            ]
        });
    };

    // API calls
    uploadSubmissionApiCall = (file: any[]) => {
        return this.studentAssignmentService.uploadSubmissionFile(file);
    };

    removeSubmissionFileApiCall = (id: string) => {
        return this.studentAssignmentService.removeSubmissionFile(id);
    };

    submitAssignment = (params: any) => {
        return this.studentAssignmentService.submitAssignment(
            params,
            this.activeEnterprise.provider_uuid
        );
    };

    // Page events
    onSubmitSubmitAssignmentForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            if (this.materialArray.length === 0) {
                this.sharedService.setSnackBar('Material is required');
            } else {
                form.value['attachmentId'] = this.materialArray.map(
                    record => record.attachmentId
                );
                form.value[
                    'assignmentId'
                ] = this.assignmentDetail.assignment_id;
                const params = removeEmptyFields(form.value);
                this.submitAssignment(params).subscribe(() => {
                    this.onCloseDialog(true);
                });
            }
        }
    };

    onFileUpload = event => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validType = !this.fileType.find(e1 => e1.name == file.type);
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
                        this.uploadSubmissionApiCall(array).subscribe(
                            response => {
                                this.materialArray.push({
                                    attachmentId:
                                        response['payload']['data'][
                                            'student_attachment_id'
                                        ],
                                    files: event.target.files,
                                    name:
                                        response['payload']['data'][
                                            'file_name'
                                        ],
                                    extension:
                                        response['payload']['data'][
                                            'file_content_type'
                                        ]
                                });
                            }
                        );
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    onRemoveFile = (id: string) => {
        this.removeSubmissionFileApiCall(id).subscribe(() => {
            let index = this.materialArray.findIndex(
                fileObj => fileObj.attachmentId === id
            );
            if (index !== -1) {
                this.materialArray.splice(index, 1);
            }
        });
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

    onCloseDialog(flag: boolean = false) {
        this.dialogRef.close(flag);
    }

    // Helper methods
    get formControls() {
        return this.submitAssignmentForm.controls;
    }

    getIcon = (extension: string) => {
        let icon = this.fileType
            .filter(e => e.name == extension)
            .map(e => e.icon)[0];
        return icon ? icon : 'defaultMaterial';
    };

    clearValue = event => {
        event.target.value = null;
    };
}
