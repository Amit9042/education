import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { AddQuestionDialogComponent } from '../add-question-dialog/add-question-dialog.component';
import { AskQuestionService } from '../../services';
import { ClassSubject } from '../../models';
import { StudentQuePreviewDialogComponent } from '../student-que-preview-dialog/student-que-preview-dialog.component';
import { RouteConstant, HttpStatus, AppMessageConstants } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-ask-doubt-select-subject',
    templateUrl: './ask-doubt-select-subject.component.html',
    styleUrls: ['./ask-doubt-select-subject.component.scss']
})
export class AskDoubtSelectSubjectComponent implements OnInit {
    subjects = new FormControl();
    subjectList: ClassSubject[] = [];
    filteredSubject: ClassSubject[] = [];

    providerUUID: string;
    isNotAdmitted: boolean = false;
    notAdmittedMsg: string; 

    constructor(private location: Location, public dialog: MatDialog,
        private askQuestionService: AskQuestionService,
        private router: Router,
        private _sharedService: SharedService) {}

    ngOnInit(): void {
        this.providerUUID = this._sharedService.getActiveEnterprise().provider_uuid;
        this.getSubjectList();
        this.subjects.valueChanges.subscribe(res => {
            res && res.length ? this.filteredSubject = [] : this.filteredSubject = this.subjectList;
            this.initFilter(res)
        });
    }

    getSubjectList = () => {
        this.askQuestionService.getSubList({providerUUID: this.providerUUID}).subscribe(response => {
            this.handleSubjectList(response.payload);
        },
        error => {
            if (error.status === HttpStatus.PROVIDER_UUID_REQUIRE) {
                this.isNotAdmitted = true;
                this.notAdmittedMsg = AppMessageConstants.NOT_ADMITTED;
            }
        })
    }

    handleSubjectList = (data) => {
        data.forEach(elem => {
            elem.class_subject_link.forEach(item => {
                const index = this.subjectList.findIndex(
                    e => e.subject_id == item.subject_id
                )
                if (index < 0) {
                    this.subjectList.push(item);
                } 
            });
        });
        this.filteredSubject = this.subjectList;
    }

    initFilter = (selectedSubject) => {
        this.subjectList.forEach(element => {
            selectedSubject.forEach(selectedElement => {
                if (element.subject_id === selectedElement.subject_id) {
                    this.filteredSubject.push(selectedElement);
                }
            });
        })
    }

    onAddQuestionDialog(subject): void {
        const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: {subject}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.onPreviewQuestionDialog(result);
            }
        }); 
    }

    onPreviewQuestionDialog(questionDetail) {
        const dialogRef = this.dialog.open(StudentQuePreviewDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: questionDetail
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.router.navigate(['/' + RouteConstant.STUDENT_QUESTION_ANSWER, result]);
            } else if (result != undefined) {
                this.onAddQuestionDialog(questionDetail);
            }
        });
    }

    onBack() {
        this.location.back();
    }

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/userProfile.svg';
    };
}
