import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentDetailModel } from '@sharedModule/models';
import {
    ALLOWED_MATERIAL_AUDIO_FILE_TYPES,
    ALLOWED_MATERIAL_DOC_FILE_TYPES,
    ALLOWED_MATERIAL_FILE_TYPES,
    ALLOWED_MATERIAL_IMAGE_FILE_TYPES,
    ALLOWED_MATERIAL_PDF_FILE_TYPES,
    ALLOWED_MATERIAL_VIDEO_FILE_TYPES
} from '@sharedModule/constants';
import {
    DocMaterialViewDialogComponent,
    ImageMaterialViewComponent,
    PdfMaterialDialogComponent,
    ViewMaterialDialogComponent
} from '@sharedModule/components';

@Component({
    selector: 'es-user-assignment-details-content-view',
    templateUrl: './assignment-details-content-view.component.html',
    styleUrls: ['./assignment-details-content-view.component.scss']
})
export class AssignmentDetailsContentViewComponent implements OnInit {
    // Angular variables
    @Input() assignmentDetails: AssignmentDetailModel;

    // Constant variables
    fileType = ALLOWED_MATERIAL_FILE_TYPES;
    videoType = ALLOWED_MATERIAL_VIDEO_FILE_TYPES;
    audioType = ALLOWED_MATERIAL_AUDIO_FILE_TYPES;
    docType = ALLOWED_MATERIAL_DOC_FILE_TYPES;
    pdfType = ALLOWED_MATERIAL_PDF_FILE_TYPES;
    imageType = ALLOWED_MATERIAL_IMAGE_FILE_TYPES;

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {}

    // Page events
    getIcon = (extension: string) => {
        let icon = this.fileType
            .filter(e => e.name == extension)
            .map(e => e.icon)[0];
        return icon ? icon : 'defaultMaterial';
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
                    totalNumber: this.assignmentDetails
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetails
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
                    totalNumber: this.assignmentDetails
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetails
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
                    totalNumber: this.assignmentDetails
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetails
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
                    totalNumber: this.assignmentDetails
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetails
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
                    totalNumber: this.assignmentDetails
                        .provider_assignment_attachments.length,
                    currentNumber: index
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let assignment = this.assignmentDetails
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
}
