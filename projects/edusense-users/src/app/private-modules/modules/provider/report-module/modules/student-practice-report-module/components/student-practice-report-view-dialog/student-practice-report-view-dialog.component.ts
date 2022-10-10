import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'es-user-student-practice-report-view-dialog',
  templateUrl: './student-practice-report-view-dialog.component.html',
  styleUrls: ['./student-practice-report-view-dialog.component.scss']
})
export class StudentPracticeReportViewDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StudentPracticeReportViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void { }

  onDialogClose(){
    this.dialogRef.close();
  }

}
