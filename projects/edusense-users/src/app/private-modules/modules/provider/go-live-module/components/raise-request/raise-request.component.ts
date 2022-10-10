import { Component, OnInit, Inject } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
    selector: 'app-raise-request',
    templateUrl: './raise-request.component.html',
    styleUrls: ['./raise-request.component.scss']
})
export class RaiseRequestComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<RaiseRequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {}

    onCloseDialog(flag: boolean): void {
        this.dialogRef.close(flag);
    }
}
