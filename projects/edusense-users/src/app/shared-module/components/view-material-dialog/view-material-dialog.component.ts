import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import {
    ALLOWED_MATERIAL_FILE_TYPES,
    CHANGE_MATERIAL_VIDEO_FILE_TYPES,
    CommonRegexp
} from '@sharedModule/constants';

@Component({
    selector: 'app-view-material-dialog',
    templateUrl: './view-material-dialog.component.html',
    styleUrls: ['./view-material-dialog.component.scss']
})
export class ViewMaterialDialogComponent implements OnInit {
    materialId;
    materialName;
    fileType;
    video;
    documentData;
    isAudio;
    fileTypeList = ALLOWED_MATERIAL_FILE_TYPES;
    changeFileTypeList = CHANGE_MATERIAL_VIDEO_FILE_TYPES;
    isYoutube;

    // Data variables
    totalNumber: number;
    currentNumber: number;

    // State variables
    showSlider = false;
    showOptions = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ViewMaterialDialogComponent>,
        protected sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.materialId = this.data['materialId'];
        this.materialName = this.data['materialName'];
        const value = this.changeFileTypeList.find(
            e => e.name == this.data['fileType']
        );
        this.fileType = value ? value.use : this.data['fileType'];
        this.isAudio = this.data['isAudio'];
        this.isYoutube = this.data['isYoutube'];
        this.documentData = this.data['fileData'];
        if (this.data['showSlider']) {
            this.showSlider = this.data['showSlider'];
        }
        if ('showOptions' in this.data) {
            this.showOptions = this.data['showOptions'];
        }
        if (this.data['totalNumber']) {
            this.totalNumber = +this.data['totalNumber'];
        }
        if (this.data['currentNumber']) {
            this.currentNumber = +this.data['currentNumber'];
        }
        this.getFileDetail();
    }

    onCloseDialog(index?: number): void {
        this.dialogRef.close(index);
    }

    async getFileDetail() {
        if (this.documentData.substring) {
            if (this.isYoutube) {
                const match = this.documentData.match(CommonRegexp.LINK_REGEXP);
                this.video = this.sanitizer.bypassSecurityTrustResourceUrl(
                    `https://www.youtube.com/embed/${match[1]}`
                );
            } else {
                this.video = this.documentData;
            }
        } else {
            let objectURL = URL.createObjectURL(this.documentData);
            this.video = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
    }

    download() {
        const link = document.createElement('a');
        let objectURL = this.documentData.substring
            ? this.documentData
            : URL.createObjectURL(this.documentData);
        link.setAttribute('href', objectURL);
        link.setAttribute('download', this.materialName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    getFileIcon = type => {
        return this.fileTypeList
            .filter(e => e.name == type)
            .map(e => e.icon)[0];
    };

    // @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    //     debugger;
    //     this.dialogRef.close();
    // }

    //onEscapePress(event) {
    // if (event.keyCode === 27) {
    //     this.dialogRef.close();
    // }
    //}
}
