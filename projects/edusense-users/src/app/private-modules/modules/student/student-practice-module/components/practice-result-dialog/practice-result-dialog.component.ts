import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentPracticeResultModel } from '../../models';

@Component({
    selector: 'es-user-practice-result-dialog',
    templateUrl: './practice-result-dialog.component.html',
    styleUrls: ['./practice-result-dialog.component.scss']
})
export class PracticeResultDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<PracticeResultDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: StudentPracticeResultModel
    ) {}

    ngOnInit(): void { }

    onCloseDialog(flag: boolean) {
        this.dialogRef.close(flag);
    }
}
