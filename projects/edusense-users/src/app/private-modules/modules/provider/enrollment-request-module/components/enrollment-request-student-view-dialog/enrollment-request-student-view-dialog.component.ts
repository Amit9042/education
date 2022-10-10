import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {EnrollStatusEnum} from '@sharedModule/constants';
import { ConfirmationMessageDialogComponent } from '@sharedModule/components';
import { EnrolmentRequestService } from '../../services';
import { SharedService } from '@sharedModule/services';


@Component({
  selector: 'app-enrollment-request-student-view-dialog',
  templateUrl: './enrollment-request-student-view-dialog.component.html',
  styleUrls: ['./enrollment-request-student-view-dialog.component.scss']
})
export class EnrollmentRequestStudentViewDialogComponent implements OnInit {

  enrollDetail;
  userData;
  enrollStatuses = EnrollStatusEnum;

  constructor(
    public dialogRef: MatDialogRef<EnrollmentRequestStudentViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private enrolReqService: EnrolmentRequestService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    if (this.data.enrllDetail) {
      this.enrollDetail = this.data.enrllDetail;
      this.userData = this.data.userData;
    }
  }

  onOpenRejectDialog(requestId: number): void {
    const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
        data: {
            title: 'Confirmation',
            caption: 'Are you sure want to reject?',
            primaryButtonLabel: 'Reject',
            secondaryButtonLabel: 'Cancel'
        }
    });

    dialogRef.afterClosed().subscribe((reject) => {
        if (reject) {
            this.onReject(requestId);
        }
    });
  }

  onAccept(enrllDetail) {
    const params = { request_id: enrllDetail.request_id };
    this.enrolReqService.enrollReqAccept(params).subscribe((response) => {
        this.onAssignEnrollmentRequestDialog(true, enrllDetail);
    });
  }

  onReject(requestId: number) {
    const params = { request_id: requestId };
    this.enrolReqService.enrollReqReject(params).subscribe((response) => {
      this.onCloseDialog(true); 
    });
  }

  onAssignEnrollmentRequestDialog(isAcceptOrReject, enrllDetail): void {
    this.onCloseDialog(isAcceptOrReject, enrllDetail);
  }

  onCloseDialog(isAcceptOrReject?, enrollDetail?) {
    const data = {
      isApiCall: isAcceptOrReject,
      enrllDetail: enrollDetail
    }
    this.dialogRef.close(data);
  }

}
