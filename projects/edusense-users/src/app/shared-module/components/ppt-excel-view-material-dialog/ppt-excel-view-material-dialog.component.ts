import { Component, OnInit, Inject } from '@angular/core';
import { saveFile } from '@sharedModule/functions';
import { ForageService } from '@sharedModule/services';
import { ALLOWED_MATERIAL_FILE_TYPES } from '@sharedModule/constants';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-ppt-excel-view-material-dialog',
    templateUrl: './ppt-excel-view-material-dialog.component.html',
    styleUrls: ['./ppt-excel-view-material-dialog.component.scss']
})
export class PptExcelViewMaterialDialogComponent implements OnInit {
    materialId;
    materialName;
    fileType;
    doc;
    documentData;
    fileTypeList = ALLOWED_MATERIAL_FILE_TYPES;
    isExcel;

    constructor(
        public dialogRef: MatDialogRef<PptExcelViewMaterialDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private forageService: ForageService
    ) {}

    ngOnInit() {
        this.isExcel = this.data['isExcel'];
        this.materialId = this.data['materialId'];
        this.materialName = this.data['materialName'];
        this.fileType = this.data['fileType'];
        this.getFileDetail();
    }

    onCloseDialog(): void {
        this.dialogRef.close();
    }

    async getFileDetail() {
        this.documentData = await this.forageService.getDocument(
            this.materialName + this.materialId
        );
        const fileReader = new FileReader();
        const that = this;
        fileReader.onload = function(event) {
            that.doc = event.target['result'];
        };
        fileReader.readAsArrayBuffer(this.documentData as Blob);
    }

    donwload() {
        saveFile(this.documentData, this.materialName);
    }

    getFileIcon = type => {
        return this.fileTypeList
            .filter(e => e.name == type)
            .map(e => e.icon)[0];
    };
}
