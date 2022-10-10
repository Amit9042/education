import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ViewType, RouteConstant, PAGE_SIZE_OPTIONS, UserTypeEnum, REDIRECTION_FROM } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { merge, throwError, forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { isEmpty } from '@sharedModule/functions';
import { ReceivedDoubtsService } from '../../services';
import { SharedService } from '@sharedModule/services';
import { DoubtGradeModel, DoubtSubjectModel, DoubtList } from '../../models';

@Component({
    selector: 'es-user-all-doubts',
    templateUrl: './all-doubts.component.html',
    styleUrls: ['./all-doubts.component.scss']
})
export class AllDoubtsComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Data;
    userType = UserTypeEnum;
    redirectionFrom = REDIRECTION_FROM;

    // Other variables
    linkLable = 'View Recieved Doubts'; 
    title = 'Recieved Doubts';

    questionFilterField = new FormControl('');
    subjectFilterField = new FormControl('All');
    gradeFilterField = new FormControl('All');
    dateFilterField = new FormControl({value: '', disabled: true});

    gradeList: DoubtGradeModel[] = [];
    subjectList: DoubtSubjectModel[] = [];
    allDoubtList: DoubtList[] = [];

    rowNumber = 1;
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];

    constructor(private location: Location, private router: Router,
        public datepipe: DatePipe,
        private receivedDoubtService: ReceivedDoubtsService,
        private sharedService: SharedService
        ) {}

    ngOnInit(): void {
        this.getData();
        this.initialize();
    }

    getData = () => {        
        forkJoin([
            this.receivedDoubtService.getGradeList({}),
            this.receivedDoubtService.getSubList({})
        ]).subscribe(
            allResponses => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleSubjectList(allResponses[1]['payload']);
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
            });
    }

    getAllDoubts = (params) => {
        return this.receivedDoubtService.getAllDoubts(params);
    }

    getAllDoubtsList = () => {
        const params = this.prepareSearchParameter();
        this.receivedDoubtService.getAllDoubts(params).subscribe(response => {
            this.handleAllDoubtList(response);
        })
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
        const config = this.sharedService.getUserConfig();
        const params = {
            recordsPerPage: this.recordsPerPage,
            rowNumber: this.rowNumber,
            provider_id: config?.provider_list[0]['provider_id']
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

    onBack() {
        this.location.back();
    }

    onViewAllDoubts(event) {
        if (event) {
            this.router.navigate(['/' + RouteConstant.PROVIDER_RECIEVED_DOUBTS]);
        }
    }

    onQuestionAnswer(event) {
        if (event && event._id) {
            this.sharedService.setRedirectionFrom(this.redirectionFrom.AllDoubts);
            this.router.navigate(['/' + RouteConstant.PROVIDER_QUESTION_ANSWER, event._id]);
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

    compareSubjects(object1: any, object2: any) {
        return object1 && object2 && object1 == object2;
    }

    onClearDateFilter = () => {
        this.dateFilterField.setValue('');
    }
}
