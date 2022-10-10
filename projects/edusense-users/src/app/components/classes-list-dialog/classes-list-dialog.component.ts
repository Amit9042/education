import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    PAGE_SIZE_OPTIONS,
    RouteConstant,
    ViewType
} from '@sharedModule/constants';
import { Classes } from '@sharedModule/models';
import { ClassesService } from '../../private-modules/modules/provider/classes-module/service';
// @ts-ignore
import { Provider } from '../../public-modules/models';
import { SharedService } from '@sharedModule/services';
import { CLASS_SESSION_STATUS } from '../../shared-module/constants/app-base.constants';

@Component({
    selector: 'app-classes-list-dialog',
    templateUrl: './classes-list-dialog.component.html',
    styleUrls: ['./classes-list-dialog.component.scss']
})
export class ClassesListDialogComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Loading;
    classSessionStatus = CLASS_SESSION_STATUS;

    // Datasourse variables
    providerDetails: Provider;
    classList: Classes[] = [];

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(
        public dialogRef: MatDialogRef<ClassesListDialogComponent>,
        private _router: Router,
        private sharedService: SharedService,
        private classesService: ClassesService
    ) {}

    ngOnInit() {
        const config = this.sharedService.getUserConfig();
        if (config.provider_list.length) {
            this.providerDetails = config.provider_list[0];
            this.getClassList();
        }
    }

    getClassList() {
        const params = {
            showAll: false,
            sortBy: 'created_at',
            sortOrder: 'desc',
            rowNumber: this.rowNumber,
            recordsPerPage: this.recordsPerPage
        };
        this.classesService.goLiveClassList(params).subscribe(
            (response) => {
                this.totalElements = response.pager.totalRecords;
                const classList: Classes[] = response.payload;
                this.classList = this.classList.concat(classList);
                this.currentViewType = this.classList.length
                    ? ViewType.Data
                    : ViewType.NoData;
            },
            (err) => {
                console.error(err);
            }
        );
    }

    onStreaming = (classDetail: Classes) => {
        const params = { class_id: classDetail.class_id };
        this.classesService.joinClass(params).subscribe((response) => {
            this.onCloseDialog();
            this.sharedService.setProviderChannel(
                response.payload
            );
            this._router.navigate(['/' + RouteConstant.GO_LIVE_MODULE_ROUTE]);
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
