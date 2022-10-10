import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    PAGE_SIZE_OPTIONS,
    RouteConstant,
    ViewType,
    CLASS_SESSION_STATUS,
    HttpStatus,
    AppMessageConstants
} from '@sharedModule/constants';
import { StudentClassesService } from '../../private-modules/services';
import { StudentClasses } from '@sharedModule/models';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'app-student-join-class-dialog',
    templateUrl: './student-join-class-dialog.component.html',
    styleUrls: ['./student-join-class-dialog.component.scss']
})
export class StudentJoinClassDialogComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Loading;
    classSessionStatus = CLASS_SESSION_STATUS;

    // Datasourse variables
    classList: StudentClasses[] = [];
    providerUUID: string;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;
    isNotAdmitted: boolean = false;
    notAdmittedMsg: string;

    constructor(
        private _router: Router,
        public dialogRef: MatDialogRef<StudentJoinClassDialogComponent>,
        protected sharedService: SharedService,
        protected classService: StudentClassesService
    ) {}

    ngOnInit() {
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
        this.getClassList();
    }

    getClassList() {
        const params = {
            showAll: false,
            sortBy: 'created_at',
            sortOrder: 'desc',
            rowNumber: this.rowNumber,
            recordsPerPage: this.recordsPerPage,
            providerUUID: this.providerUUID
        };
        this.classService.classList(params).subscribe((response) => {
            this.totalElements = response.pager.totalRecords;
            const classList: StudentClasses[] = response.payload;
            this.classList = this.classList.concat(classList);
            this.currentViewType = this.classList.length
                ? ViewType.Data
                : ViewType.NoData;
        },
        (err) => {
            this.currentViewType = this.viewType.NoData;
            if (err.status === HttpStatus.PROVIDER_UUID_REQUIRE) {
                this.isNotAdmitted = true;
                this.notAdmittedMsg = AppMessageConstants.NOT_ADMITTED;
            }
        });
    }

    onJoinClass = (classDetails: StudentClasses) => {
        const params = { class_id: classDetails.class_id, providerUUID: this.providerUUID };
        this.classService.joinClass(params).subscribe((response) => {
            this.onCloseDialog();
            const oldChannel = this.sharedService.getStudentChannel();
            this.sharedService.setStudentChannel(response.payload);
            if (oldChannel) {
                this.sharedService.setStudentChannelUpdate(true);
            }
            this._router.navigate([
                '/' + RouteConstant.STUDENT_JOIN_CLASS_MODULE_ROUTE
            ]);
        });
    };

    onCloseDialog() {
        this.dialogRef.close();
    }

    onScroll = () => {
        const newRowNumber = this.rowNumber + this.recordsPerPage;
        if (newRowNumber <= this.totalElements) {
            this.rowNumber = newRowNumber;
            this.getClassList();
        }
    };
}
