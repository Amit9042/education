import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-pdf-material-dialog',
    templateUrl: './pdf-material-dialog.component.html',
    styleUrls: ['./pdf-material-dialog.component.scss']
})
export class PdfMaterialDialogComponent implements OnInit {
    pdfSrc;
    materialId;
    materialName;
    fileType;
    documentData;

    // Data variables
    totalNumber: number;
    currentNumber: number;

    // State variables
    showSlider = false;
    showOptions = true;
    showDownload = true;

    constructor(
        public dialogRef: MatDialogRef<PdfMaterialDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
        this.materialId = this.data['materialId'];
        this.materialName = this.data['materialName'];
        this.fileType = this.data['fileType'];
        this.documentData = this.data['fileData'];
        if (this.data['showSlider']) {
            this.showSlider = this.data['showSlider'];
        }
        if ('showOptions' in this.data) {
            this.showOptions = this.data['showOptions'];
        }
        if ('showDownload' in this.data) {
            this.showDownload = this.data['showDownload'];
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
            this.pdfSrc = this.documentData;
        } else {
            const fileReader = new FileReader();
            const that = this;
            fileReader.onload = function(event) {
                that.pdfSrc = event.target['result'];
            };
            fileReader.readAsArrayBuffer(this.documentData as Blob);
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
