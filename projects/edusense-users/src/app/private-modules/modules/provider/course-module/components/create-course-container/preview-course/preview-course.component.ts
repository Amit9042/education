import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourseService } from '../../../services';
import {
    CourseModel,
    CoursePreviewModel,
    LectureResourcesModel
} from '../../../models';
import {
    ALLOWED_RESOURCES_FILE_TYPES,
    CONTENT_TYPE
} from '@sharedModule/constants';
import {
    PdfMaterialDialogComponent,
    ViewMaterialDialogComponent
} from '@sharedModule/components';
import { MatDialog } from '@angular/material/dialog';
import { getVideoDuration, saveFile } from '@sharedModule/functions';

@Component({
    selector: 'es-user-preview-course',
    templateUrl: './preview-course.component.html',
    styleUrls: ['./preview-course.component.scss']
})
export class PreviewCourseComponent implements OnInit {
    // Angular variables
    @Output() onChangeStep = new EventEmitter();
    @Input() courseId: number;

    // Constant variables
    contentType = CONTENT_TYPE;
    resourceFileType = ALLOWED_RESOURCES_FILE_TYPES;

    // Data variables
    coursePreviewDetails: CoursePreviewModel[] = [];
    courseDetails: CourseModel;
    parentIndex;
    currentIndex;

    constructor(
        private courseService: CourseService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getPreviewDetails();
        this.getCourseDetails();
    }

    // Initialisation methods
    getPreviewDetails = () => {
        this.getCoursePreviewApiCall().subscribe(response => {
            this.coursePreviewDetails = response['payload']['sections'];
        });
    };

    getCourseDetails = () => {
        this.getCourseDetailsApiCall().subscribe(response => {
            this.courseDetails = response['payload']['course'];
        });
    };

    // Api calls
    getCoursePreviewApiCall = () => {
        return this.courseService.getCoursePreview(+this.courseId);
    };

    publishCourseApiCall = () => {
        return this.courseService.publishCourse(+this.courseId);
    };

    getCourseDetailsApiCall = () => {
        return this.courseService.getCourseDetails(this.courseId);
    };

    // Page events
    onTogglePanel(pIndex, cIndex) {
        if (this.parentIndex === pIndex && this.currentIndex === cIndex) {
            this.parentIndex = null;
            this.currentIndex = null;
        } else {
            this.parentIndex = pIndex;
            this.currentIndex = cIndex;
        }
    }

    onClickVideo = (path: string, type: string) => {
        const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
            panelClass: 'view-material-dialog-container',
            data: {
                fileData: path,
                isYoutube: false,
                isAudio: false,
                showOptions: false,
                fileType: type
            }
        });
        dialogRef.afterClosed().subscribe(result => {});
    };

    onClickYoutubeVideo = (path: string) => {
        const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
            panelClass: 'view-material-dialog-container',
            data: {
                fileData: path,
                isYoutube: true,
                isAudio: false,
                showOptions: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {});
    };

    onClickFile = (path: string) => {
        const dialogRef = this.dialog.open(PdfMaterialDialogComponent, {
            panelClass: 'pdf-material-dialog-container',
            data: {
                fileData: path,
                fileType: 'application/pdf',
                showOptions: false,
                showDownload: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {});
    };

    onPreviewStep() {
        this.onChangeStep.emit('additional-info');
    }

    onPublicCourse() {
        this.publishCourseApiCall().subscribe(() => {
            this.onChangeStep.emit('enrollment-course');
        });
    }

    saveFile = (resource: LectureResourcesModel) => {
        saveFile(resource?.content_path, resource.title);
    };

    // Helper methods
    getIcon = (extension: string) => {
        let icon = this.resourceFileType
            .filter(e => e.name == extension)
            .map(e => e.icon)[0];
        return icon ? icon : 'defaultMaterial';
    };

    getDuration = (seconds: number) => {
        return getVideoDuration(seconds);
    };
}
