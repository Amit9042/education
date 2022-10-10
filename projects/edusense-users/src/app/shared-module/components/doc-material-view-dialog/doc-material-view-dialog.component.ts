import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as mammoth from 'mammoth/mammoth.browser.js';
import { ALLOWED_MATERIAL_FILE_TYPES } from '@sharedModule/constants';
import { MaterialService } from '../../../private-modules/modules/provider/material-module/service/material.service';

@Component({
    selector: 'app-doc-material-view-dialog',
    templateUrl: './doc-material-view-dialog.component.html',
    styleUrls: ['./doc-material-view-dialog.component.scss']
})
export class DocMaterialViewDialogComponent implements OnInit {
    materialId;
    materialName;
    fileType;
    doc;
    documentData;
    documentUrl;
    fileTypeList = ALLOWED_MATERIAL_FILE_TYPES;

    // Data variables
    totalNumber: number;
    currentNumber: number;

    // State variables
    showSlider = false;

    constructor(
        public dialogRef: MatDialogRef<DocMaterialViewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _materialService: MaterialService
    ) {}

    ngOnInit() {
        this.materialId = this.data['materialId'];
        this.materialName = this.data['materialName'];
        this.fileType = this.data['fileType'];
        this.documentUrl = this.data['fileData'];
        this.documentData = this.data['fileData'];
        if (this.documentData.substring) {
            this.downloadMaterial();
        } else {
            this.getFileDetail();
        }
        if (this.data['showSlider']) {
            this.showSlider = this.data['showSlider'];
        }
        if (this.data['totalNumber']) {
            this.totalNumber = +this.data['totalNumber'];
        }
        if (this.data['currentNumber']) {
            this.currentNumber = +this.data['currentNumber'];
        }
    }

    onCloseDialog(index?: number): void {
        this.dialogRef.close(index);
    }

    async getFileDetail() {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            let a = event.target['result'];
            mammoth
                .extractRawText({ arrayBuffer: a })
                .then(result => {
                    document.getElementById('doc').innerHTML = result.value;
                })
                .done();
        };
        fileReader.readAsArrayBuffer(this.documentData as Blob);
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

    getFileIcon = type => {
        return this.fileTypeList
            .filter(e => e.name == type)
            .map(e => e.icon)[0];
    };

    downloadMaterial = () => {
        this._materialService
            .downloadMaterialBlob(this.documentData)
            .subscribe(async response => {
                this.documentData = response;
                this.getFileDetail();
            });
    };
}
