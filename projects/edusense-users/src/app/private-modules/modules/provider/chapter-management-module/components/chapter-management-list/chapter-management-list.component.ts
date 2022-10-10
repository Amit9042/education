import { Component, OnInit } from '@angular/core';
import {
    OperatorEnum,
    PAGE_SIZE_OPTIONS,
    RouteConstant
} from '@sharedModule/constants';
import { FormBuilder, FormControl } from '@angular/forms';
import {
    ConfirmationMessageDialogComponent,
    FormBaseComponent
} from '@sharedModule/components';
import { CreateChapterDetailsComponent } from '../create-chapter-details/create-chapter-details.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterManagementService } from '../../services';
import { merge, throwError } from 'rxjs';
import { catchError, debounceTime, startWith, switchMap } from 'rxjs/operators';
import { MaterialGrade, MaterialSubject } from '@sharedModule/models';
import { ChapterManagementListModel } from '../../models';

@Component({
    selector: 'es-user-chapter-management-list',
    templateUrl: './chapter-management-list.component.html',
    styleUrls: ['./chapter-management-list.component.scss']
})
export class ChapterManagementListComponent extends FormBaseComponent
    implements OnInit {
    // State Variables
    isShowFilter = false;

    // Form variables
    chapterNameFormControl = new FormControl();
    gradeFormControl = new FormControl();
    subjectFormControl = new FormControl();

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    // Data variables
    gradeList: MaterialGrade[] = [];
    subjectList: MaterialSubject[] = [];
    chapterList: ChapterManagementListModel[] = [];
    displayedColumns = [
        'chapter_name',
        'description',
        'grade',
        'subject',
        'action'
    ];

    // State variables
    isLoadingResults = false;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private chapterManagementService: ChapterManagementService,
        private activeRoute: ActivatedRoute
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.routeSubscriber();
        this.getChapterListBasedOnSearch();
    };

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.gradeList) {
                let gradeArray = resolvedData.gradeList;
                this.gradeList = gradeArray.map((record) => {
                    return { ...record, ...{ name: record.grade.alias } };
                });
            }
            if (resolvedData.subjectList) {
                this.subjectList = resolvedData.subjectList;
            }
        });
    };

    getChapterListBasedOnSearch = () => {
        this.isLoadingResults = true;
        merge(
            this.chapterNameFormControl.valueChanges,
            this.gradeFormControl.valueChanges,
            this.subjectFormControl.valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    return this.getChapterManagementListApiCall();
                }),
                catchError((error) => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe((response) => {
                this.handleChapterManagementListResponse(response);
            });
    };

    handleChapterManagementListResponse = (response: any) => {
        this.chapterList = response['payload']['content'];
        this.totalElements = response['payload']['pageable']['totalElements'];
        this.isLoadingResults = false;
    };

    // API Calls
    getChapterManagementListApiCall = () => {
        return this.chapterManagementService.getProviderChapterList(
            this.queryParams()
        );
    };

    removeChapterApiCall = (chapterId: number) => {
        return this.chapterManagementService.removeProviderChapter(chapterId);
    };

    // Page Events
    getChapterList = () => {
        this.getChapterManagementListApiCall().subscribe((response) => {
            this.handleChapterManagementListResponse(response);
        });
    };

    onChangePagination = (params) => {
        this.rowNumber =
            this.recordsPerPage === params['recordsPerPage']
                ? +params['rowNumber']
                : 1;
        this.recordsPerPage = +params['recordsPerPage'];
        this.getChapterList();
    };

    openCreateChapterDialog() {
        const dialogRef = this.dialog.open(CreateChapterDetailsComponent, {
            panelClass: 'meeting-dialog-container',
            data: {
                gradeList: this.gradeList,
                subjectList: this.subjectList
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getChapterList();
            }
        });
    }

    onViewChapter(chapter: ChapterManagementListModel) {
        this.router.navigate([
            '/' + RouteConstant.CHAPTER_MANAGEMENT_VIEW,
            chapter.id
        ]);
    }

    onEditChapter(chapter: ChapterManagementListModel) {
        const dialogRef = this.dialog.open(CreateChapterDetailsComponent, {
            panelClass: 'meeting-dialog-container',
            data: {
                gradeList: this.gradeList,
                subjectList: this.subjectList,
                chapterDetails: chapter
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getChapterList();
            }
        });
    }

    onDeleteChapter(chapter: ChapterManagementListModel) {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Confirmation',
                caption:
                    'Are you sure you want to remove Chapter from the list?',
                primaryButtonLabel: 'Remove Chapter',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.removeChapterApiCall(chapter.id).subscribe(() => {
                    this.getChapterList();
                });
            }
        });
    }

    // Helper methods
    queryParams = (): any => {
        const criteriaArray = [];
        if (this.chapterNameFormControl.value) {
            criteriaArray.push({
                column: 'title',
                operator: OperatorEnum.CONTAIN,
                values: [this.chapterNameFormControl.value]
            });
        }
        if (this.gradeFormControl.value) {
            criteriaArray.push({
                column: 'grade',
                operator: OperatorEnum.CONTAIN,
                values: [this.gradeFormControl.value]
            });
        }
        if (this.subjectFormControl.value) {
            criteriaArray.push({
                column: 'subject',
                operator: OperatorEnum.CONTAIN,
                values: [this.subjectFormControl.value]
            });
        }

        return {
            offset: this.rowNumber,
            limit: this.recordsPerPage,
            sort: {
                column: 'id',
                sortType: 'desc'
            },
            criteria: criteriaArray
        };
    };
}
