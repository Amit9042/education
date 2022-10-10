import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationMessageDialogComponent } from 'utility-lib';

@Component({
    selector: 'es-user-student-course-notes-details',
    templateUrl: './student-course-notes-details.component.html',
    styleUrls: ['./student-course-notes-details.component.scss']
})
export class StudentCourseNotesDetailsComponent implements OnInit {
    // state variable
    isShowTextDescription = false;

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {}

    onConfirmationDialogOpen = () => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: ' Delete Notes',
                caption: 'Are you sure you want to Delete?',
                primaryButtonLabel: 'No',
                secondaryButtonLabel: 'Yes'
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    };

    onFocusCourseNote() {
        this.isShowTextDescription = true;
    }

    onHideCourseDecription() {
        this.isShowTextDescription = false;
    }

    onEditTextDescription() {
        this.isShowTextDescription = true;
    }
}
