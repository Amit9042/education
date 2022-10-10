import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-image-material-view',
    templateUrl: './image-material-view.component.html',
    styleUrls: ['./image-material-view.component.scss']
})
export class ImageMaterialViewComponent implements OnInit {
    materialId;
    materialName;
    fileType;
    image;
    documentData;

    // Data variables
    totalNumber: number;
    currentNumber: number;

    // State variables
    showSlider = false;

    constructor(
        public dialogRef: MatDialogRef<ImageMaterialViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        protected sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.materialId = this.data['materialId'];
        this.materialName = this.data['materialName'];
        this.fileType = this.data['fileType'];
        this.documentData = this.data['fileData'];
        if (this.data['showSlider']) {
            this.showSlider = this.data['showSlider'];
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

    // Helpers
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: any) {
        if (event.keyCode === 27) {
            this.onCloseDialog();
        }
    }

    async getFileDetail() {
        if (this.documentData.substring) {
            this.image = this.documentData;
        } else {
            let objectURL = URL.createObjectURL(this.documentData);
            this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
    }

    donwload() {
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
}
