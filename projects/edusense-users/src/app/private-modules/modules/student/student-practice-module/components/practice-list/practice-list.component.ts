import { Component, OnInit } from '@angular/core';
import { PAGE_SIZE_OPTIONS, RouteConstant } from '@sharedModule/constants';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentPracticeService } from '../../services';
import { merge, throwError } from 'rxjs';
import { catchError, debounceTime, startWith, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { MaterialSubject } from '@sharedModule/models';
import {
    StudentPracticeListModel,
    StudentPracticeResultModel
} from '../../models';
import { EnterpriseDetail } from '../../../../../../public-modules/models';
import { AllDoubtService } from '../../../student-doubts-module/services';
import { PracticeResultDialogComponent } from '../practice-result-dialog/practice-result-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'es-user-practice-list',
    templateUrl: './practice-list.component.html',
    styleUrls: ['./practice-list.component.scss']
})
export class PracticeListComponent implements OnInit {
    // Data variables
    subjectId: number;
    userDetails: any;
    subject: MaterialSubject;
    practiceList: StudentPracticeListModel[] = [];
    activeEnterprise: EnterpriseDetail;
    chapterId: number;
    chapterName: string;

    // Form variables
    practiceStatus = new FormControl();
    practiceName = new FormControl();

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    // State Variables
    isLoadingResults = true;

    constructor(
        private location: Location,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private studentPracticeService: StudentPracticeService,
        private sharedUserService: SharedUserService,
        private sharedService: SharedService,
        private allDoubtService: AllDoubtService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.subjectId = +this.activatedRoute.snapshot.params['id'];
        this.chapterId = +this.activatedRoute.snapshot.params['cId'];
        this.userDetails = this.sharedUserService.getUser();
        this.getSubjectList();
        this.getChapterList();
        this.getPracticeListBasedOnSearch();
    }

    // Initialisation methods
    getPracticeListBasedOnSearch = () => {
        merge(this.practiceStatus.valueChanges, this.practiceName.valueChanges)
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.practiceListApiCall(this.getQueryParams());
                }),
                catchError((error) => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe((response) => {
                this.handlePracticeListResponse(response);
            });
    };

    handlePracticeListResponse = (response: any) => {
        this.practiceList = response['payload']['content'];
        this.totalElements = response.payload.pageable.totalElements;
        this.isLoadingResults = false;
    };

    getSubjectList = () => {
        this.subjectListApiCall().subscribe((response) => {
            let array: any[] = response['payload'];
            let subjectList = [];
            array.forEach((subject) => {
                subject.class_subject_link.forEach((element) => {
                    let subject: any = {};
                    subject['subject_id'] = element.subject_id;
                    subject['name'] = element.subject_master.name;
                    subject['description'] = element.subject_master.description;
                    subject['logo'] = element.subject_master.logo;
                    subjectList.push(subject);
                });
            });
            this.subject = subjectList.find(
                (record) => record.subject_id === this.subjectId
            );
        });
    };

    // API calls
    practiceListApiCall = (params) => {
        return this.studentPracticeService.getPracticeList(
            params,
            this.activeEnterprise.provider_uuid
        );
    };

    subjectListApiCall = () => {
        return this.allDoubtService.getSubList({
            providerUUID: this.activeEnterprise.provider_uuid
        });
    };

    //Page events
    onChangePagination = (params) => {
        this.rowNumber =
            this.recordsPerPage === params['recordsPerPage']
                ? +params['rowNumber']
                : 1;
        this.recordsPerPage = +params['recordsPerPage'];
        this.getStudentPracticeList();
    };

    getStudentPracticeList = () => {
        this.isLoadingResults = true;
        this.practiceListApiCall(this.getQueryParams()).subscribe(
            (response) => {
                this.handlePracticeListResponse(response);
            }
        );
    };

    onPracticeQuestionList = (
        practice: StudentPracticeListModel,
        isPracticeCompleted
    ) => {
        if (isPracticeCompleted) {
            this.studentPracticeService.setIsPracitceDetailView(true);
        }
        this.router.navigate([
            '/' + RouteConstant.PRACTICE_QUESTION_STUDENT,
            practice.id
        ]);
    };

    onBack = () => {
        this.location.back();
    };

    onBookmarkQuestionOpen() {
        this.router.navigate(['/' + RouteConstant.STUDENT_BOOKMARK_QUESTION]);
    }

    // Helper methods
    getQueryParams = () => {
        let params = {
            gradeId: this.userDetails.grade_id,
            subjectId: this.subjectId,
            offset: this.rowNumber - 1,
            limit: this.recordsPerPage,
            chapterId: this.chapterId
        };
        if (this.practiceName.value) {
            params['name'] = this.practiceName.value;
        }
        if (this.practiceStatus.value) {
            params['status'] = this.practiceStatus.value;
        }
        return params;
    };

    onViewPracticeResult = (practiceDetail) => {
        this.studentPracticeService
            .getPracticeResult(practiceDetail.id)
            .subscribe((response) => {
                const practiceResult = response.payload;
                practiceResult['practiseName'] = practiceDetail.name;
                this.onPracticeResultOpen(practiceResult);
            });
    };

    onPracticeResultOpen = (result: StudentPracticeResultModel) => {
        const dialogRef = this._dialog.open(PracticeResultDialogComponent, {
            panelClass: 'practice-result-dialog-container',
            data: result
        });

        dialogRef.afterClosed().subscribe((result) => {});
    };

    getChapterList = () => {
        const params = {
            limit: 100000,
            offset: 0
        };
        this.studentPracticeService
            .getPracticeChapterList(params, this.activeEnterprise.provider_uuid)
            .subscribe((response) => {
                const chapterList = response.payload.content;
                if (chapterList.length) {
                    chapterList.forEach((elem) => {
                        if (elem.id == this.chapterId) {
                            this.chapterName = elem.title;
                        }
                    });
                }
            });
    };

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    };
}
