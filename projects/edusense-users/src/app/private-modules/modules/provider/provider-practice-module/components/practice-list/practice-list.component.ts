import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
    PAGE_SIZE_OPTIONS,
    RouteConstant,
    OperatorEnum
} from '@sharedModule/constants';
import { checkEmptyValue, getQueryParams } from '@sharedModule/functions';
import { MatDialog } from '@angular/material/dialog';
import { PracticeDetailsDialogComponent } from '../dialogs/practice-details-dialog/practice-details-dialog.component';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PracticeService } from '../../service';
import { merge } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { ProviderPracticeModel, ChapterModel } from '../../models';
import { SharedService } from '@sharedModule/services';
import { ParentClasses } from '@sharedModule/models';

@Component({
    selector: 'es-user-practice-list',
    templateUrl: './practice-list.component.html',
    styleUrls: ['./practice-list.component.scss']
})
export class PracticeListComponent implements OnInit {
    // Form variables
    searchTitle: FormControl = new FormControl('');
    searchStatus: FormControl = new FormControl('');
    searchChapter: FormControl = new FormControl('');

    // Data related variables
    practiceList: ProviderPracticeModel[] = [];
    criteriaArray = [];
    selectedGradeAndSubject;
    chapterList: ChapterModel[] = [];
    folderList: any[] = [];
    parentClassList: ParentClasses[] = [];
    userConfigDetails;

    // State variables
    criteria = {};
    isLoadingResults = false;

    // Pagination variables
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    totalElements = 0;
    rowNumber = 1;

    constructor(
        private location: Location,
        public dialog: MatDialog,
        private router: Router,
        private practiceService: PracticeService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.selectedGradeAndSubject = this.practiceService.getPracticeFilterData();
        this.userConfigDetails = this.sharedService.getUserConfig();
        this.searchTitleValueChanges();
        this.getQuizChaperList();
        this.getQuizFolderList();
        this.getParentClassList();
    }

    searchTitleValueChanges = () => {
        merge(
            this.searchTitle.valueChanges,
            this.searchStatus.valueChanges,
            this.searchChapter.valueChanges
        )
            .pipe(startWith({}), debounceTime(300))
            .subscribe((res) => {
                this.getPracticeList();
            });
    };

    getPracticeList = () => {
        this.isLoadingResults = true;
        this.practiceList = [];
        this.practiceService
            .getPracticeList(this.queryParams())
            .subscribe((response) => {
                this.handlePracticeListResponse(response);
            });
    };

    handlePracticeListResponse = (response) => {
        this.isLoadingResults = false;
        this.practiceList = response.payload.content;
        // this.recordsPerPage = response.payload.pageable.pageSize;
        // this.totalPages = response.payload.pageable.totalPages;
        this.totalElements = response.payload.pageable.totalElements;
        // this.rowNumber = response.payload.pageable.pageNumber + 1;
    };

    onPublish = (practiceId) => {
        this.practiceService
            .publishPractice(practiceId)
            .subscribe((response) => {
                this.practiceList.forEach((element) => {
                    if (element.id === practiceId) {
                        element.published = response.payload.published;
                    }
                });
            });
    };

    getParentClassList = () => {
        this.isLoadingResults = true;
        this.practiceService
            .getParentClassList({
                provider_id: this.userConfigDetails['provider_list'][0][
                    'provider_id'
                ],
                ...getQueryParams(
                    {
                        grade_id: this.selectedGradeAndSubject.grade_id,
                        is_active: 1
                    },
                    null,
                    0,
                    0,
                    true
                )
            })
            .subscribe((response) => {
                this.isLoadingResults = false;
                this.parentClassList = response.payload;
            });
    };

    getQuizChaperList = () => {
        this.isLoadingResults = true;
        this.practiceService
            .getQuizChaperList(this.chapterListQueryParams())
            .subscribe((response) => {
                this.isLoadingResults = false;
                this.chapterList = response.payload.content;
            });
    };

    getQuizFolderList = () => {
        this.isLoadingResults = true;
        this.practiceService
            .getQuizFolderList(this.chapterListQueryParams())
            .subscribe((response) => {
                this.isLoadingResults = false;
                this.folderList = response.payload.content;
            });
    };

    onSelectQuestionList(practice) {
        // if (!practice.published) {
        let selectedChapters = [];
        this.folderList.forEach((folder) => {
            practice.chapterIds.forEach((folderId) => {
                if (folder.id === folderId) {
                    selectedChapters.push(folder);
                }
            });
        });

        practice['chapters'] = selectedChapters;
        this.selectedGradeAndSubject['practiceDetails'] = { ...practice };
        this.practiceService.setPracticeFilterData(
            this.selectedGradeAndSubject
        );
        this.router.navigate(['/' + RouteConstant.QUESTION_SELECT_PRACTICE]);
        // }
    }

    onAddPracticeDetails = () => {
        this.onPracticeDetailsDialogOpen(this.selectedGradeAndSubject);
    };

    onEditPracticeDetails = (practice) => {
        let practiceDetail = { ...this.selectedGradeAndSubject, ...practice };
        let selectedChapters = [];
        this.folderList.forEach((folder) => {
            practice.chapterIds.forEach((folderId) => {
                if (folder.id === folderId) {
                    selectedChapters.push(folder);
                }
            });
        });
        practiceDetail['chapters'] = selectedChapters;
        this.onPracticeDetailsDialogOpen(practiceDetail);
    };

    onPracticeDetailsDialogOpen = (practiceDetails) => {
        let practiceDetail = {
            ...practiceDetails,
            chapterList: this.chapterList,
            parentClassList: this.parentClassList
        };
        const dialogRef = this.dialog.open(PracticeDetailsDialogComponent, {
            panelClass: 'practice-details-dialog-container',
            data: practiceDetail
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getPracticeList();
            }
        });
    };

    onChangePagination = (params) => {
        this.rowNumber =
            this.recordsPerPage === params['recordsPerPage']
                ? +params['rowNumber']
                : 1;
        this.recordsPerPage = +params['recordsPerPage'];
        this.getPracticeList();
    };

    onBack = () => {
        this.location.back();
    };

    // Helper methods
    queryParams = (): any => {
        this.criteriaArray = [
            {
                column: 'gradeId',
                operator: OperatorEnum.EQUALS,
                values: [this.selectedGradeAndSubject.grade_id]
            },
            {
                column: 'subjectId',
                operator: OperatorEnum.EQUALS,
                values: [this.selectedGradeAndSubject.subject_id]
            },
            {
                column: 'deleted',
                operator: OperatorEnum.FALSE
            }
        ];
        if (this.searchTitle.value) {
            this.criteriaArray.push({
                column: 'name',
                operator: OperatorEnum.CONTAIN,
                values: [this.searchTitle.value]
            });
        }
        if (!checkEmptyValue(this.searchStatus.value)) {
            this.criteriaArray.push({
                column: 'published',
                operator: this.searchStatus.value
                    ? OperatorEnum.TRUE
                    : OperatorEnum.FALSE
            });
        }
        if (this.searchChapter.value) {
            this.criteriaArray.push({
                column: 'chapterMasterId',
                operator: OperatorEnum.IN,
                values: [this.searchChapter.value]
            });
        }
        return {
            offset: this.rowNumber,
            limit: this.recordsPerPage,
            sort: {
                column: 'id',
                sortType: 'desc'
            },
            criteria: this.criteriaArray
        };
    };

    chapterListQueryParams = (): any => {
        this.criteriaArray = [
            {
                column: 'gradeId',
                operator: OperatorEnum.EQUALS,
                values: [this.selectedGradeAndSubject.grade_id]
            },
            {
                column: 'subjectId',
                operator: OperatorEnum.EQUALS,
                values: [this.selectedGradeAndSubject.subject_id]
            },
            {
                column: 'deleted',
                operator: OperatorEnum.FALSE
            }
        ];
        return {
            offset: 1,
            limit: 2147483647,

            sort: {
                column: 'title',
                sortType: 'asc'
            },
            criteria: this.criteriaArray
        };
    };

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    };
}
