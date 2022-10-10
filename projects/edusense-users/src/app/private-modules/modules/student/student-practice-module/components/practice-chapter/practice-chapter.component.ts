import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RouteConstant } from '@sharedModule/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialSubject } from '@sharedModule/models';
import { StudentChapterModel, StudentPracticeListModel, StudentPracticeResultModel } from '../../models';
import { SharedService } from '@sharedModule/services';
import { AllDoubtService } from '../../../student-doubts-module/services';
import { StudentPracticeService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { PracticeResultDialogComponent } from '../practice-result-dialog/practice-result-dialog.component';

@Component({
    selector: 'es-user-practice-chapter',
    templateUrl: './practice-chapter.component.html',
    styleUrls: ['./practice-chapter.component.scss']
})
export class PracticeChapterComponent implements OnInit {
    // Data variables
    subject: MaterialSubject;
    subjectId: number;
    practiceList: StudentPracticeListModel[] = [];
    chapterList: StudentChapterModel[] = [];
    totalChapterList: StudentChapterModel[] = [];
    providerUUID: string;

    constructor(
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private sharedService: SharedService,
        private router: Router,
        private allDoubtService: AllDoubtService,
        private _studentpracticeService: StudentPracticeService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.subjectId = +this.activatedRoute.snapshot.params['id'];
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
        this.getSubjectList();
        this.routeSubscriber();
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activatedRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.practiceList) {
                this.practiceList = resolvedData.practiceList;
            }
            if (resolvedData.chapterList) {
                this.totalChapterList = resolvedData.chapterList;
                if (this.totalChapterList.length > 11) {
                    this.chapterList = resolvedData.chapterList.slice(0, 11);
                } else {
                    this.chapterList = this.totalChapterList;
                }
            }
        });
    };

    getSubjectList = () => {
        this.subjectListApiCall().subscribe(response => {
            let array: any[] = response['payload'];
            let subjectList = [];
            array.forEach(subject => {
                subject.class_subject_link.forEach(element => {
                    let subject: any = {};
                    subject['subject_id'] = element.subject_id;
                    subject['name'] = element.subject_master.name;
                    subject['description'] = element.subject_master.description;
                    subject['logo'] = element.subject_master.logo;
                    subjectList.push(subject);
                });
            });
            this.subject = subjectList.find(
                record => record.subject_id === this.subjectId
            );
        });
    };

    // API Calls
    subjectListApiCall = () => {
        return this.allDoubtService.getSubList({
            providerUUID: this.providerUUID
        });
    };

    //Page events
    onPracticeQuestionList = (practice: StudentPracticeListModel, isPracticeCompleted) => {
        if (isPracticeCompleted) {
            this._studentpracticeService.setIsPracitceDetailView(true);
        }
        this.router.navigate([
            '/' + RouteConstant.PRACTICE_QUESTION_STUDENT,
            practice.id
        ]);
    };

    onClickViewMore = () => {
        this.chapterList = this.totalChapterList;
    };

    onClickViewLess = () => {
        this.chapterList = this.totalChapterList.slice(0, 11);
    }

    onBack = () => {
        this.location.back();
    };

    onPracticeListOpen(chapter: StudentChapterModel) {
        this.router.navigate([
            '/' + RouteConstant.PRACTICE_LIST_STUDENT,
            chapter.subjectId,
            chapter.id
        ]);
    }

    onBookmarkQuestionOpen() {
        this.router.navigate(['/' + RouteConstant.STUDENT_BOOKMARK_QUESTION]);
    }

    // Helper methods
    onError = event => {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    };

    getChapterName = (name: string) => {
        let length = name.length;
        if (length > 30) {
            name = name.slice(0, 30) + ' ...';
        }
        return name;
    };

    onViewPracticeResult = (practiceDetail) => {
        this._studentpracticeService.getPracticeResult(practiceDetail.id).subscribe(response => {
            const practiceResult = response.payload;
            practiceResult['practiseName'] = practiceDetail.name;
            this.onPracticeResultOpen(practiceResult);
        })
    }

    onPracticeResultOpen = (result: StudentPracticeResultModel) => {
        const dialogRef = this._dialog.open(PracticeResultDialogComponent, {
            panelClass: 'practice-result-dialog-container',
            data: result
        });

        dialogRef.afterClosed().subscribe(result => {});
    };
}
