import { Component, OnInit } from '@angular/core';
import { ViewType, RouteConstant, PAGE_SIZE_OPTIONS, UserTypeEnum, REDIRECTION_FROM, HttpStatus, AppMessageConstants } from '@sharedModule/constants';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AllDoubtService } from '../../services';
import { SharedService } from '@sharedModule/services';
import { StudentAllDoubtList } from '../../models';

@Component({
    selector: 'es-user-student-all-bookmark-doubts',
    templateUrl: './student-all-bookmark-doubts.component.html',
    styleUrls: ['./student-all-bookmark-doubts.component.scss']
})
export class StudentAllBookmarkDoubtsComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Data;
    userType = UserTypeEnum;
    redirectionFrom = REDIRECTION_FROM;

    // Other variables
    linkLable = 'View All Doubts';
    title = 'All Doubts';

    allDoubtList: StudentAllDoubtList[] = [];
    bookmarkedList: StudentAllDoubtList[] = [];

    rowNumber = 1;
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];

    providerUUID: string;
    isNotAdmitted: boolean = false;
    notAdmittedMsg: string; 

    constructor(private location: Location, private router: Router,
        private allDoubtService: AllDoubtService,
        private sharedService: SharedService) {}

    ngOnInit(): void {
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
        this.initialize();
    }

    initialize = () => {
        this.getAllDoubtsList();
        this.getBookmarkedDoubt();
    }

    getAllDoubtsList = () => {
        const params = {
            recordsPerPage: this.recordsPerPage,
            rowNumber: this.rowNumber,
            providerUUID: this.providerUUID
        }
        this.allDoubtService.getAllDoubtList(params).subscribe(response => {
            this.allDoubtList = response.payload.data;
        },
        error => {
            if (error.status === HttpStatus.PROVIDER_UUID_REQUIRE) {
                this.isNotAdmitted = true;
                this.notAdmittedMsg = AppMessageConstants.NOT_ADMITTED;
            }
        })
    }

    getBookmarkedDoubt = () => {
        const params = this.prepareParams();
        this.allDoubtService.getAllDoubtList(params).subscribe(response => {
            this.handleResponse(response);
        },
        error => {
            this.currentViewType = this.viewType.NoData;
            if (error.status === HttpStatus.PROVIDER_UUID_REQUIRE) {
                this.isNotAdmitted = true;
                this.notAdmittedMsg = AppMessageConstants.NOT_ADMITTED;
            }
        });
    }

    handleResponse = (response) => {
        this.totalElements = response.pager.totalRecords;
            const bookmarkedList = response.payload.data;
            this.bookmarkedList = this.bookmarkedList.concat(bookmarkedList);
            this.currentViewType = this.bookmarkedList.length ? this.viewType.Data : this.viewType.NoData;
    }

    prepareParams = () => {
        const params = {
            recordsPerPage: this.recordsPerPage,
            rowNumber: this.rowNumber,
            providerUUID: this.providerUUID
        }
        params['search'] = JSON.stringify({bookmark:  true});
        return params;
    }

    onBack() {
        this.location.back();
    }

    onViewBookmark(event) {
        if (event) {
            this.router.navigate(['/' + RouteConstant.STUDENT_ALL_DOUBTS]);
        }
    }

    onQuestionAnswer(event) {
        if (event && event._id) {
            this.sharedService.setRedirectionFrom(this.redirectionFrom.BookmarkedDoubts);
            this.router.navigate(['/' + RouteConstant.STUDENT_QUESTION_ANSWER, event._id]);
        }
    }

    onBookmarkQuestion(event) {
        if (event && event._id) {
            this.allDoubtService.bookmarkQuestion(event._id).subscribe(response => {
                const index = this.bookmarkedList.findIndex(elem => elem._id === event._id);
                if (index >= 0) {
                    this.bookmarkedList.splice(index, 1);
                    if (this.bookmarkedList.length === 0) {
                        this.currentViewType = this.viewType.NoData;
                    }
                }
            })
        }
    }

    onScroll(event) {
        if (event) {
            const newRowNumber = this.rowNumber + this.recordsPerPage;
            if (newRowNumber <= this.totalElements) {
                this.rowNumber = newRowNumber;
                this.getBookmarkedDoubt();
            }
        }
    }
}
