import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-message-dialog',
    templateUrl: './confirmation-message-dialog.component.html',
    styleUrls: ['./confirmation-message-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ConfirmationMessageDialogComponent implements OnInit {

    // Data variables
    title: string;
    caption: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;

    constructor(private router: Router, @Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<ConfirmationMessageDialogComponent>) {
    }

    ngOnInit() {
        this.title = this.data['title'];
        this.caption = this.data['caption'];
        this.primaryButtonLabel = this.data['primaryButtonLabel'];
        this.secondaryButtonLabel = this.data['secondaryButtonLabel'];
    }

    // Page events
    onSave() {
        this.dialogRef.close(true);
    }

    onCloseDialog() {
        this.dialogRef.close(false);
    }

}
