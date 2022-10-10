import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { FormControl } from '@angular/forms';
import { MaterialGrade } from '@sharedModule/models';
import { PracticeService } from '../../service';
import { SharedService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { userAllowed } from '@sharedModule/functions';

@Component({
    selector: 'es-user-choose-grade-practice',
    templateUrl: './choose-grade-practice.component.html',
    styleUrls: ['./choose-grade-practice.component.scss']
})
export class ChooseGradePracticeComponent implements OnInit {
    // static variable
    isGradeSelected = false;

    grades = new FormControl();
    gradeList: MaterialGrade[] = [];
    filteredGrade: MaterialGrade[] = [];

    constructor(
        private router: Router,
        private practiceService: PracticeService,
        private sharedService: SharedService,
        private _mixpanelService: MixpanelService
    ) {}

    ngOnInit(): void {
        this.getGradeList();
        this.grades.valueChanges.subscribe((res) => {
            res && res.length
                ? (this.filteredGrade = [])
                : (this.filteredGrade = this.gradeList);
            this.initFilter(res);
        });
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_GRADE_LIST, {});
    }

    getGradeList = () => {
        this.practiceService.getGradeList({}).subscribe((response) => {
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
        this.isGradeSelected = true;
        this.practiceService.setPracticeFilterData(filterData);
        this.router.navigate(['/' + RouteConstant.CHOOSE_SUBJECT_PRACTICE]);
    };
    onChooseSubjectOpen() {
        this.router.navigate(['/' + RouteConstant.CHOOSE_SUBJECT_PRACTICE]);
    }
}
