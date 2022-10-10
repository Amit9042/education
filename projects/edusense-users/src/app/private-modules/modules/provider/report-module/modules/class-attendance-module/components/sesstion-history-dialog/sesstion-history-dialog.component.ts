import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentSessionHistoryModel } from '../../models';
import { getTotalDuration } from '@sharedModule/functions';

@Component({
    selector: 'es-user-sesstion-history-dialog',
    templateUrl: './sesstion-history-dialog.component.html',
    styleUrls: ['./sesstion-history-dialog.component.scss']
})
export class SesstionHistoryDialogComponent implements OnInit {
    // Data variables
    sessionHistory: StudentSessionHistoryModel;
    displayedColumns: string[] = [
        'sr_no',
        'start_time',
        'end_time',
        'duration'
    ];
    dataSource = [
        {
            sr_no: 1,
            start_time: '11:20 a.m.',
            end_time: '11:24 a.m.',
            duration: '00:05:00'
        },
        {
            sr_no: 2,
            start_time: '11:20 a.m.',
            end_time: '11:24 a.m.',
            duration: '00:05:00'
        },
        {
            sr_no: 3,
            start_time: '11:20 a.m.',
            end_time: '11:24 a.m.',
            duration: '00:05:00'
        },
        {
            sr_no: 4,
            start_time: '11:20 a.m.',
            end_time: '11:24 a.m.',
            duration: '00:05:00'
        }
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SesstionHistoryDialogComponent>
    ) {}

    ngOnInit(): void {
        this.sessionHistory = this.data['sessionHistory'];
    }

    onCloseDialog(flag: boolean): void {
        this.dialogRef.close(flag);
    }

  // Helper methods
  getDuration(seconds: number) {
    return getTotalDuration(seconds);
  }
}
