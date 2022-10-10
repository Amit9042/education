import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouteConstant } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { MaterialSubject } from '@sharedModule/models';
import { QuestionBankService } from '../../service';

@Component({
    selector: 'es-user-que-bank-subject',
    templateUrl: './que-bank-subject.component.html',
    styleUrls: ['./que-bank-subject.component.scss']
})
export class QueBankSubjectComponent implements OnInit {
    subjects = new FormControl();

    subjectList: MaterialSubject[] = [];
    filteredSubject: MaterialSubject[] = [];
    questionBankFilterData;

    constructor(
        private router: Router,
        private questionBankService: QuestionBankService
    ) {}

    ngOnInit(): void {
        this.questionBankFilterData = this.questionBankService.getQuestionBankFilterData();
        this.getSubjectList();
        this.subjects.valueChanges.subscribe((res) => {
            res && res.length
                ? (this.filteredSubject = [])
                : (this.filteredSubject = this.subjectList);
            this.initFilter(res);
        });
    }

    getSubjectList = () => {
        this.questionBankService.getSubList({}).subscribe((response) => {
            this.subjectList = response.payload;
            this.filteredSubject = this.subjectList;
        });
    };

    initFilter = (selectedSubject) => {
        this.subjectList.forEach((element) => {
            selectedSubject.forEach((selectedElement) => {
                if (element.subject_id === selectedElement.subject_id) {
                    this.filteredSubject.push(selectedElement);
                }
            });
        });
    };

    onGradeUrl = () => {
        this.router.navigate(['/' + RouteConstant.QUE_BANK_GRADE]);
    };

    onChapterSelection = (subjectId, sName, sLogo) => {
        this.questionBankFilterData['subject_id'] = subjectId;
        this.questionBankFilterData['subject_name'] = sName;
        this.questionBankFilterData['subject_logo'] = sLogo;
        this.questionBankService.setQuestionBankFilterData(
            this.questionBankFilterData
        );
        this.router.navigate(['/' + RouteConstant.QUE_BANK_CHAPTER_LIST]);
    };

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    };
}
