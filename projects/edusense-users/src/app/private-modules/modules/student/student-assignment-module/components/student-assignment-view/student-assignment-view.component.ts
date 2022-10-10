import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentSubmissionDialogComponent } from '../assignment-submission-dialog/assignment-submission-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentDetailModel } from '@sharedModule/models';
import {
    ALLOWED_MATERIAL_AUDIO_FILE_TYPES,
    ALLOWED_MATERIAL_DOC_FILE_TYPES,
    ALLOWED_MATERIAL_FILE_TYPES,
    ALLOWED_MATERIAL_IMAGE_FILE_TYPES,
    ALLOWED_MATERIAL_PDF_FILE_TYPES,
    ALLOWED_MATERIAL_VIDEO_FILE_TYPES,
    RouteConstant
} from '@sharedModule/constants';
import {
    DocMaterialViewDialogComponent,
    ImageMaterialViewComponent,
    PdfMaterialDialogComponent,
    ViewMaterialDialogComponent
} from '@sharedModule/components';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-student-assignment-view',
    templateUrl: './student-assignment-view.component.html',
    styleUrls: ['./student-assignment-view.component.scss']
})
export class StudentAssignmentViewComponent implements OnInit, OnDestroy {
    // Data variables
    assignmentDetail: AssignmentDetailModel;

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
        private router: Router,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.routeSubscriber();
    }

    ngOnDestroy() {
        this.sharedService.setAssignmentRedirectionData('');
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.assignmentDetail) {
                this.assignmentDetail = resolvedData.assignmentDetail;
            }
        });
    };

    // Page events
    getIcon = (extension: string) => {
        let icon = this.fileType
            .filter(e => e.name == extension)
            .map(e => e.icon)[0];
        return icon ? icon : 'defaultMaterial';
    };

    openSubmissionDialog() {
        const dialogRef = this.dialog.open(
            AssignmentSubmissionDialogComponent,
            {
                panelClass: 'meeting-dialog-container',
                data: { assignmentDetail: this.assignmentDetail }
            }
        );

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.router.navigate([
                    '/' + RouteConstant.STUDENT_ASSIGNMENT_LIST
                ]);
            }
        });
    }

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
                    totalNumber: this.assignmentDetail
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetail
                        .provider_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.attachment_id,
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
                    totalNumber: this.assignmentDetail
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetail
                        .provider_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.attachment_id,
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
                    totalNumber: this.assignmentDetail
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetail
                        .provider_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.attachment_id,
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
                    totalNumber: this.assignmentDetail
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetail
                        .provider_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.attachment_id,
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
                    totalNumber: this.assignmentDetail
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetail
                        .provider_assignment_attachments[result - 1];
                    this.viewDownloadMaterial(
                        assignment.attachment_id,
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
        let redirectData = this.sharedService.getAssignmentRedirectionData();
        this.sharedService.setDateForAssignmentRedirection(redirectData);
        this.router.navigate([
            '/' + RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE
        ]);
    }
}
