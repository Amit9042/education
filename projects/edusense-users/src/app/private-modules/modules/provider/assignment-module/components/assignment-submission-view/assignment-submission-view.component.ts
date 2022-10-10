import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentCheckDialogComponent } from '../assignment-check-dialog/assignment-check-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AssignmentViewService } from '../../services';
import {
    ALLOWED_MATERIAL_AUDIO_FILE_TYPES,
    ALLOWED_MATERIAL_DOC_FILE_TYPES,
    ALLOWED_MATERIAL_FILE_TYPES,
    ALLOWED_MATERIAL_IMAGE_FILE_TYPES,
    ALLOWED_MATERIAL_PDF_FILE_TYPES,
    ALLOWED_MATERIAL_VIDEO_FILE_TYPES
} from '@sharedModule/constants';
import { SubmittedAssignmentModel } from '@sharedModule/models';
import {
    DocMaterialViewDialogComponent,
    ImageMaterialViewComponent,
    PdfMaterialDialogComponent,
    ViewMaterialDialogComponent
} from '@sharedModule/components';
import { UserConfigModel } from '../../../../../../public-modules/models';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-assignment-submission-view',
    templateUrl: './assignment-submission-view.component.html',
    styleUrls: ['./assignment-submission-view.component.scss']
})
export class AssignmentSubmissionViewComponent implements OnInit {
    //Data variables
    submissionAssignmentDetail: SubmittedAssignmentModel;
    userConfigDetails: UserConfigModel;

    // Constant variables
    fileType = ALLOWED_MATERIAL_FILE_TYPES;
    videoType = ALLOWED_MATERIAL_VIDEO_FILE_TYPES;
    audioType = ALLOWED_MATERIAL_AUDIO_FILE_TYPES;
    docType = ALLOWED_MATERIAL_DOC_FILE_TYPES;
    pdfType = ALLOWED_MATERIAL_PDF_FILE_TYPES;
    imageType = ALLOWED_MATERIAL_IMAGE_FILE_TYPES;

    constructor(
        private location: Location,
        public dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private assignmentViewService: AssignmentViewService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.routeSubscriber();
        this.userConfigDetails = this.sharedService.getUserConfig();
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.submissionAssignmentDetail) {
                this.submissionAssignmentDetail =
                    resolvedData.submissionAssignmentDetail;
            }
        });
    };

    // API calls
    getSubmittedAssignmentDetailApiCall = () => {
        return this.assignmentViewService.getSubmittedAssignmentDetails(
            this.submissionAssignmentDetail.student_assignment_id.toString()
        );
    };

    // Page events
    getIcon = (extension: string) => {
        let icon = this.fileType
            .filter(e => e.name == extension)
            .map(e => e.icon)[0];
        return icon ? icon : 'defaultMaterial';
    };

    openCheckDialog() {
        const dialogRef = this.dialog.open(AssignmentCheckDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: {
                submissionId: this.submissionAssignmentDetail
                    .student_assignment_id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getSubmittedAssignmentDetail();
            }
        });
    }

    getSubmittedAssignmentDetail = () => {
        this.getSubmittedAssignmentDetailApiCall().subscribe(response => {
            this.submissionAssignmentDetail = response['payload']['data'];
        });
    };

    viewDownloadMaterial(materialId, materialName, fileType, fileData, index) {
        event.stopPropagation();
        if (this.videoType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
                panelClass: 'view-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    isAudio: false,
                    fileData,
                    showSlider: true,
                    totalNumber: this.submissionAssignmentDetail
                        .student_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.submissionAssignmentDetail
                        .student_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.student_attachment_id,
                        assignment.file_name,
                        assignment.file_content_type,
                        assignment.file_path,
                        result
                    );
                }
            });
        } else if (this.audioType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
                panelClass: 'view-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    isAudio: true,
                    fileData,
                    showSlider: true,
                    totalNumber: this.submissionAssignmentDetail
                        .student_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.submissionAssignmentDetail
                        .student_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.student_attachment_id,
                        assignment.file_name,
                        assignment.file_content_type,
                        assignment.file_path,
                        result
                    );
                }
            });
        } else if (this.docType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(DocMaterialViewDialogComponent, {
                panelClass: 'view-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    fileData,
                    showSlider: true,
                    totalNumber: this.submissionAssignmentDetail
                        .student_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.submissionAssignmentDetail
                        .student_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.student_attachment_id,
                        assignment.file_name,
                        assignment.file_content_type,
                        assignment.file_path,
                        result
                    );
                }
            });
        } else if (this.pdfType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(PdfMaterialDialogComponent, {
                panelClass: 'pdf-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    fileData,
                    showSlider: true,
                    totalNumber: this.submissionAssignmentDetail
                        .student_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.submissionAssignmentDetail
                        .student_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.student_attachment_id,
                        assignment.file_name,
                        assignment.file_content_type,
                        assignment.file_path,
                        result
                    );
                }
            });
        } else if (this.imageType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(ImageMaterialViewComponent, {
                panelClass: 'pdf-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    fileData,
                    showSlider: true,
                    totalNumber: this.submissionAssignmentDetail
                        .student_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.submissionAssignmentDetail
                        .student_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.student_attachment_id,
                        assignment.file_name,
                        assignment.file_content_type,
                        assignment.file_path,
                        result
                    );
                }
            });
        } else {
            const link = document.createElement('a');
            let objectURL = fileData.substring
                ? fileData
                : URL.createObjectURL(fileData);
            link.setAttribute('href', objectURL);
            link.setAttribute('download', materialName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }

    onBack() {
        this.location.back();
    }

    // Helper methods
    getAssignmentStatus = (submittedAssignment: SubmittedAssignmentModel) => {
        switch (submittedAssignment.check_status) {
            case 2:
                return 'Complete';
            case 3:
                return 'Incomplete';
            case 4:
                return `Partially complete - ${submittedAssignment?.complete_percentage}%`;
        }
    };
}
