import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-setting-drawer',
    templateUrl: './admin-setting-drawer.component.html',
    styleUrls: ['./admin-setting-drawer.component.scss']
})
export class AdminSettingDrawerComponent implements OnInit {
    @Output() clickEvent = new EventEmitter<boolean>();

    constructor(private router: Router, public dialog: MatDialog) {}

    ngOnInit() {}

    // onchangePassword(): void {
    //     const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
    //         panelClass: 'meeting-dialog-container',
    //         data: {}
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {});
    // }

    onCloseDrawer() {
        this.clickEvent.emit(true);
    }
}
