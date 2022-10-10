import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChapterDialogComponent } from '../add-chapter-dialog/add-chapter-dialog.component';
import { Router } from '@angular/router';
import {
    RouteConstant,
    PAGE_SIZE_OPTIONS,
    OperatorEnum
} from '@sharedModule/constants';
import { QuestionBankService } from '../../service';
import { ChapterModel } from '../../models/chapter.model';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'es-user-que-bank-chapter-list',
    templateUrl: './que-bank-chapter-list.component.html',
    styleUrls: ['./que-bank-chapter-list.component.scss']
})
export class QueBankChapterListComponent implements OnInit {
    // Form variables
    searchTitle: FormControl = new FormControl('');

    // Data related variables
    folderList: ChapterModel[] = [];
    criteriaArray = [];
    selectedGradeAndSubject;

    // State variables
    criteria = {};
    isLoadingResults = true;

    // Pagination variables
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    totalElements = 0;
    rowNumber = 1;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private questionBankService: QuestionBankService
    ) {}

    ngOnInit(): void {
        this.selectedGradeAndSubject = this.questionBankService.getQuestionBankFilterData();
        this.getQuizFolderList();
        this.searchTitleValueChanges();
    }

    searchTitleValueChanges = () => {
        this.searchTitle.valueChanges.subscribe((val) => {
            this.getQuizFolderList();
        });
    };

    getQuizFolderList = () => {
        this.isLoadingResults = true;
        this.questionBankService
            .getQuizFolderList(this.queryParams())
            .subscribe((response) => {
                this.handleQuizFolderListResponse(response);
            });
    };

    handleQuizFolderListResponse = (response) => {
        this.folderList = response.payload.content;
        this.totalElements = response['payload']['pageable']['totalElements'];
        this.isLoadingResults = false;
    };

    openAddChapterDialog() {
        const dialogRef = this.dialog.open(AddChapterDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: this.selectedGradeAndSubject
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.onSelectFolder(result);
            }
        });
    }

    onChangePagination = (params) => {
        this.rowNumber =
            this.recordsPerPage === params['recordsPerPage']
                ? +params['rowNumber']
                : 1;
        this.recordsPerPage = +params['recordsPerPage'];
        this.getQuizFolderList();
    };

    onSelectFolder(folder) {
        this.selectedGradeAndSubject['folderId'] = folder.id;
        this.selectedGradeAndSubject['folder'] = folder.title;
        this.selectedGradeAndSubject['createdBy'] = folder.createdBy;
        this.questionBankService.setQuestionBankFilterData(
            this.selectedGradeAndSubject
        );
        this.router.navigate(['/' + RouteConstant.QUE_BANK_QUE_LIST]);
    }

    onBack() {
        this.router.navigate(['/' + RouteConstant.QUE_BANK_SUBJECT]);
    }

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
                column: 'title',
                operator: OperatorEnum.CONTAIN,
                values: [this.searchTitle.value]
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

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    };
}
