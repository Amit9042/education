import { Component, OnInit } from '@angular/core';
import { ViewType, RouteConstant, PAGE_SIZE_OPTIONS, UserTypeEnum, REDIRECTION_FROM, HttpStatus, AppMessageConstants } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { StudentDoubtListService, AllDoubtService } from '../../services';
import { SharedService } from '@sharedModule/services';
import { StudentAllDoubtList, StudentYourDoubtList } from '../../models';

@Component({
    selector: 'es-user-student-doubt-list',
    templateUrl: './student-doubt-list.component.html',
    styleUrls: ['./student-doubt-list.component.scss']
})
export class StudentDoubtListComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Data;
    redirectionFrom = REDIRECTION_FROM;
    userType = UserTypeEnum;

    // Other variables
    linkLable = 'View All Doubts';
    title = 'All Doubts';

    studentDoubtList: StudentYourDoubtList[] = [];
    allDoubtList: StudentAllDoubtList[] = [];

    rowNumber = 1;
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];

    providerUUID: string;
    isNotAdmitted: boolean = false;
    notAdmittedMsg: string;

    constructor(private router: Router,
        private studentDoubtListService: StudentDoubtListService,
        private allDoubtService: AllDoubtService,
        private sharedService: SharedService) {}

    ngOnInit(): void {
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
        this.initialize();
    }

    initialize = () => {
        this.getStudentQuestionList();
        this.getAllDoubtsList();
    }

    getStudentQuestionList = () => {
        // this.currentViewType = this.viewType.Loading;
        const params = this.prepareParams();
        this.studentDoubtListService.getStudentQuestionList(params).subscribe(response => {
            this.handleRequestList(response);
        },
        (err) => {
            this.currentViewType = this.viewType.NoData;
            if (err.status === HttpStatus.PROVIDER_UUID_REQUIRE) {
                this.isNotAdmitted = true;
                this.notAdmittedMsg = AppMessageConstants.NOT_ADMITTED;
            }
        })
    }

    handleRequestList = (response) => {
        this.totalElements = response.pager.totalRecords;
        const studentDoubtList = response.payload.data;
        this.studentDoubtList = this.studentDoubtList.concat(studentDoubtList);
        this.currentViewType = this.studentDoubtList.length
                ? ViewType.Data
                : ViewType.NoData;
    }

    getAllDoubtsList = () => {
        const params = this.prepareParams();
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

    prepareParams = () => {
        const params = {
            recordsPerPage: this.recordsPerPage,
            rowNumber: this.rowNumber,
            providerUUID: this.providerUUID
        }
        return params;
    }

    onAllBookmarks() {
        this.router.navigate(['/' + RouteConstant.STUDENT_ALL_BOOKMARK_DOUBTS]);
    }
    
    onSelectDoubtSubject() {
        this.router.navigate(['/' + RouteConstant.ASK_DOUBT_SELECT_SUBJECT]);
    }

    onViewAllDoubts(event) {
        if (event) {
            this.router.navigate(['/' + RouteConstant.STUDENT_ALL_DOUBTS]);
        }
    }

    onQuestionAnswer(event) {
        if (event && event._id) {
            this.sharedService.setRedirectionFrom(this.redirectionFrom.YourDoubts);
            this.router.navigate(['/' + RouteConstant.STUDENT_QUESTION_ANSWER, event._id]);
        }
    }

    onBookmarkQuestion(event) {
        if (event && event._id) {
            this.allDoubtService.bookmarkQuestion(event._id).subscribe(response => {
                this.studentDoubtList.forEach(elem => {
                    if(elem._id === event._id){
                        elem.isBookmarked = !elem.isBookmarked;
                    }
                });
            });
        }
    }

    onScroll(event) {
        if (event) {
            const newRowNumber = this.rowNumber + this.recordsPerPage;
            if (newRowNumber <= this.totalElements) {
                this.rowNumber = newRowNumber;
                this.getStudentQuestionList();
            }
        }
    }
}
