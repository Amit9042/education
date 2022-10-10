import { Component, OnInit } from '@angular/core';
import { ViewType, RouteConstant, UserTypeEnum, REDIRECTION_FROM, PAGE_SIZE_OPTIONS } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { ReceivedDoubtsService } from '../../services';
import { forkJoin, merge, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { SharedService } from '@sharedModule/services';
import { isEmpty } from '@sharedModule/functions';
import { DoubtGradeModel, DoubtSubjectModel, DoubtList } from '../../models';

@Component({
    selector: 'es-user-recieved-doubts',
    templateUrl: './recieved-doubts.component.html',
    styleUrls: ['./recieved-doubts.component.scss']
})
export class RecievedDoubtsComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Data;
    userType = UserTypeEnum;
    redirectionFrom = REDIRECTION_FROM;

    // Other variables
    linkLable = 'View All Doubts';
    title = 'All Doubts';

    questionFilterField = new FormControl('');
    subjectFilterField = new FormControl('All');
    gradeFilterField = new FormControl('All');
    dateFilterField = new FormControl({value: '', disabled: true});

    gradeList: DoubtGradeModel[] = [];
    subjectList: DoubtSubjectModel[] = [];
    allDoubtsList: DoubtList[] = [];

    receivedDoubtList: DoubtList[] = [];
    rowNumber = 1;
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];

    constructor(private router: Router,
        private receivedDoubtService: ReceivedDoubtsService,
        public datepipe: DatePipe,
        private sharedService: SharedService) {}

    ngOnInit(): void {
        this.getData();
        this.initialize();
    }

    getData = () => {
        const config = this.sharedService.getUserConfig();
        const params = {
            recordsPerPage: this.recordsPerPage,
            rowNumber: 1,
            provider_id: config.provider_list[0].provider_id
        }
        
        forkJoin([
            this.receivedDoubtService.getGradeList({}),
            this.receivedDoubtService.getSubList({}),
            this.receivedDoubtService.getAllDoubts(params)
        ]).subscribe(
            allResponses => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleSubjectList(allResponses[1]['payload']);
                this.handleAllDoubtsList(allResponses[2]['payload']);
            },
            err => {
                console.log(err);
            }
        );
    };

    handleGradeList = gradeList => {
        this.gradeList = gradeList;
    };

    handleSubjectList = list => {
        this.subjectList = list;
    };

    handleAllDoubtsList = list => {
        this.allDoubtsList = list.data;
    };

    initialize = () => {
        this.currentViewType = this.viewType.Loading;
        merge(
            this.questionFilterField.valueChanges,
            this.subjectFilterField.valueChanges,
            this.gradeFilterField.valueChanges,
            this.dateFilterField.valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    this.receivedDoubtList = [];
                    const params = this.prepareSearchParameter();
                    return this.getReceivedDoubts(params);
                }),
                catchError(error => {
                    this.currentViewType = this.viewType.NoData;
                    return throwError(error);
                })
            )
            .subscribe(response => {
                this.handleReceivedDoubtList(response);
            });
    }

    getReceivedDoubtList = () => {
        // this.currentViewType = this.viewType.Loading;
        const params = this.prepareSearchParameter();
        this.receivedDoubtService.getReceivedQuestionList(params).subscribe(response => {
            this.handleReceivedDoubtList(response);
        },
        (err) => {
            this.currentViewType = this.viewType.NoData;
            console.error(err);
        })
    }

    getReceivedDoubts = (params) => {
        return this.receivedDoubtService.getReceivedQuestionList(params);
    }

    handleReceivedDoubtList = (response) => {
        this.totalElements = response.pager.totalRecords;
        const receivedDoubtList = response.payload.data;
        this.receivedDoubtList = this.receivedDoubtList.concat(receivedDoubtList);
        this.currentViewType = this.receivedDoubtList.length
                ? ViewType.Data
                : ViewType.NoData;
    }

    prepareSearchParameter = () => {
        const params = {
            recordsPerPage: this.recordsPerPage,
            rowNumber: this.rowNumber
        }

        const searchParam = {};
        if (this.questionFilterField.value) {
            searchParam['text'] = this.questionFilterField.value;
        }
        if (this.subjectFilterField.value !== 'All') {
            searchParam['subject_id'] = this.subjectFilterField.value;
        }
        if (this.gradeFilterField.value !== 'All') {
            searchParam['grade_id'] = this.gradeFilterField.value;
        }
        if (this.dateFilterField.value) {
            const createdDate = this.dateFilterField.value;
            searchParam['created_at'] = this.datepipe.transform(createdDate, 'yyyy-MM-dd');
        }

        if (!isEmpty(searchParam)) {
            params['search'] = JSON.stringify(searchParam);
        }

        return params;
    }

    onViewAllDoubts(event) {
        if (event) {
            this.router.navigate([
                '/' + RouteConstant.PROVIDER_ALL_DOUBTS
            ]);
        }
    }

    onQuestionAnswer(event) {
        if (event) {
            this.sharedService.setRedirectionFrom(this.redirectionFrom.YourDoubts);
            this.router.navigate([
                '/' + RouteConstant.PROVIDER_QUESTION_ANSWER, event._id
            ]);
        }
    }

    onScroll(event) {
        if (event) {
            const newRowNumber = this.rowNumber + this.recordsPerPage;
            if (newRowNumber <= this.totalElements) {
                this.rowNumber = newRowNumber;
                this.getReceivedDoubtList();
            }
        }
    }

    compareSubjects(object1: any, object2: any) {
        return object1 && object2 && object1 == object2;
    }

    onClearDateFilter = () => {
        this.dateFilterField.setValue('');
    }
}
