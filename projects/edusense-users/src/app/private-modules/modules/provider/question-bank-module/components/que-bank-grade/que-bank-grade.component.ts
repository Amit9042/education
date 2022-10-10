import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { QuestionBankService } from '../../service';
import { MaterialGrade } from '@sharedModule/models';
import { SharedService } from '@sharedModule/services';
import { userAllowed } from '@sharedModule/functions';

@Component({
    selector: 'es-user-que-bank-grade',
    templateUrl: './que-bank-grade.component.html',
    styleUrls: ['./que-bank-grade.component.scss']
})
export class QueBankGradeComponent implements OnInit {
    // static variable
    isGradeSelected = false;

    grades = new FormControl();
    gradeList: MaterialGrade[] = [];
    filteredGrade: MaterialGrade[] = [];

    constructor(
        private router: Router,
        private sharedService: SharedService,
        private questionBankService: QuestionBankService
    ) {}

    ngOnInit(): void {
        this.getGradeList();
        this.grades.valueChanges.subscribe((res) => {
            res && res.length
                ? (this.filteredGrade = [])
                : (this.filteredGrade = this.gradeList);
            this.initFilter(res);
        });
    }

    getGradeList = () => {
        this.questionBankService.getGradeList({}).subscribe((response) => {
            this.gradeList = response.payload;
            this.filteredGrade = this.gradeList;
        });
    };

    initFilter = (selectedGrades) => {
        this.gradeList.forEach((element) => {
            selectedGrades.forEach((selectedElement) => {
                if (element.grade_id === selectedElement.grade_id) {
                    this.filteredGrade.push(selectedElement);
                }
            });
        });
    };

    onSubjectSelection = (gradeId, gName) => {
        const isUserAllowed = userAllowed(this.sharedService);
        if (!isUserAllowed) {
            return;
        }
        const filterData = { grade_id: gradeId, grade_name: gName };
        this.questionBankService.setQuestionBankFilterData(filterData);
        this.isGradeSelected = true;
        this.router.navigate(['/' + RouteConstant.QUE_BANK_SUBJECT]);
    };
}
