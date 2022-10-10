import { Component, OnInit } from '@angular/core';
import { ViewType, RouteConstant, PAGE_SIZE_OPTIONS, UserTypeEnum, REDIRECTION_FROM, HttpStatus, AppMessageConstants } from '@sharedModule/constants';
import { Location, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { merge, throwError, forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { SharedService } from '@sharedModule/services';
import { AllDoubtService, StudentDoubtListService } from '../../services';
import { isEmpty } from '@sharedModule/functions';
import { StudentAllDoubtList, SubjectModel, StudentYourDoubtList } from '../../models';

@Component({
    selector: 'es-user-student-all-doubts',
    templateUrl: './student-all-doubts.component.html',
    styleUrls: ['./student-all-doubts.component.scss']
})
export class StudentAllDoubtsComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Data;
    redirectionFrom = REDIRECTION_FROM;
    userType = UserTypeEnum;

    questionFilterField: FormControl = new FormControl('');
    subjectFilterField = new FormControl('All');
    dateFilterField = new FormControl('');

    allDoubtList: StudentAllDoubtList[] = [];
    receivedDoubtList: StudentYourDoubtList[] = [];
    subjectList = [];

    // Other variables
    linkLable = 'View Your Doubts';
    title = 'Your Doubts';

    rowNumber = 1;
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];

    providerUUID: string;
    isNotAdmitted: boolean = false;
    notAdmittedMsg: string;

    constructor(private location: Location, private router: Router,
        public datepipe: DatePipe,
        private sharedService: SharedService,
        private allDoubtService: AllDoubtService,
        private studentDoubtListService: StudentDoubtListService) {}

    ngOnInit(): void {
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
        this.getData();
        this.initialize();
    }

    getData = () => {
        const params = {
            recordsPerPage: this.recordsPerPage,
            rowNumber: this.rowNumber,
            providerUUID: this.providerUUID
        }

        forkJoin([
            this.allDoubtService.getSubList({ providerUUID: this.providerUUID }),
            this.studentDoubtListService.getStudentQuestionList(params)
        ]).subscribe(
            allResponses => {
                this.handleSubjectList(allResponses[0]['payload']);
                this.handleReceivedDoubtList(allResponses[1]['payload']);
            },
            err => {
                console.log(err);
            }
        );
    };

    handleSubjectList = data => {
        data.forEach(elem => {
            elem.class_subject_link.forEach(item => {
                const index = this.subjectList.findIndex(
                    e => e.subject_id == item.subject_id
                )
                if (index < 0) {
                    const data = item.subject_master;
                    data['subject_id'] = item.subject_id;
                    this.subjectList.push(data);
                } 
            });
        });
    };

    handleReceivedDoubtList = response => {
        this.receivedDoubtList = response.data;
    }

    initialize = () => {
        this.currentViewType = this.viewType.Loading;
        merge(
            this.questionFilterField.valueChanges,
            this.subjectFilterField.valueChanges,
            this.dateFilterField.valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    this.allDoubtList = [];
                    const params = this.prepareSearchParameter();
                    return this.getAllDoubts(params);
                }),
                catchError(error => {
                    this.currentViewType = this.viewType.NoData;
                    return throwError(error);
                })
            )
            .subscribe(response => {
                this.handleAllDoubtList(response);
                // this.currentViewType = this.viewType.Data;
            },
            error => {
                if (error.status === HttpStatus.PROVIDER_UUID_REQUIRE) {
                    this.isNotAdmitted = true;
                    this.notAdmittedMsg = AppMessageConstants.NOT_ADMITTED;
                }
            });
    }

    getAllDoubts = (params) => {
        return this.allDoubtService.getAllDoubtList(params);
    }

    handleAllDoubtList = (response) => {
        this.totalElements = response.pager.totalRecords;
        const allDoubtList = response.payload.data;
        this.allDoubtList = this.allDoubtList.concat(allDoubtList);
        this.currentViewType = this.allDoubtList.length
                ? ViewType.Data
                : ViewType.NoData;
    }

    prepareSearchParameter = () => {
        // const config = this.sharedService.getUserConfig();
        const params = {
            recordsPerPage: this.recordsPerPage,
            rowNumber: this.rowNumber
        }

        const searchParam = {};
        if (this.questionFilterField.value) {
            searchParam['text'] = this.questionFilterField.value;
        }
        if (this.subjectFilterField.value !== 'All') {
            searchParam['subject_id'] = [this.subjectFilterField.value];
        }
        if (this.dateFilterField.value) {
            const createdDate = this.dateFilterField.value;
            searchParam['created_at'] = this.datepipe.transform(createdDate, 'yyyy-MM-dd');
        }
        if (!isEmpty(searchParam)) {
            params['search'] = JSON.stringify(searchParam);
            params['showAll'] = false;
        }
        params['providerUUID'] = this.providerUUID;
        
        return params;
    }

    getAllDoubtsList = () => {
        const params = this.prepareSearchParameter();
        this.allDoubtService.getAllDoubtList(params).subscribe(response => {
            this.handleAllDoubtList(response);
        })
    }

    onBack() {
        this.location.back();
    }

    onViewAllDoubts(event) {
        if (event) {
            this.router.navigate(['/' + RouteConstant.STUDENT_DOUBT_LIST]);
        }
    }

    onQuestionAnswer(event) {
        if (event && event._id) {
            this.sharedService.setRedirectionFrom(this.redirectionFrom.AllDoubts);
            this.router.navigate(['/' + RouteConstant.STUDENT_QUESTION_ANSWER, event._id]);
        }
    }

    compareSubjects(object1: any, object2: any) {
        return object1 && object2 && object1 == object2;
    }

    onBookmarkQuestion(event) {
        if (event && event._id) {
            this.allDoubtService.bookmarkQuestion(event._id).subscribe(response => {
                this.allDoubtList.forEach(elem => {
                    if(elem._id === event._id){
                        elem.isBookmarked = !elem.isBookmarked;
                    }
                });
            })
        }
    }

    onScroll(event) {
        if (event) {
            const newRowNumber = this.rowNumber + this.recordsPerPage;
            if (newRowNumber <= this.totalElements) {
                this.rowNumber = newRowNumber;
                this.getAllDoubtsList();
            }
        }
    }

    onClearDateFilter = () => {
        this.dateFilterField.setValue('');
    }
}
