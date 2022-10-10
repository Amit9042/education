import { Component, OnInit } from '@angular/core';
import { RouteConstant, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MaterialSubject } from '@sharedModule/models';
import { PracticeService } from '../../service';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'es-user-choose-subject-practice',
    templateUrl: './choose-subject-practice.component.html',
    styleUrls: ['./choose-subject-practice.component.scss']
})
export class ChooseSubjectPracticeComponent implements OnInit {
    subjects = new FormControl();

    subjectList: MaterialSubject[] = [];
    filteredSubject: MaterialSubject[] = [];
    practiceFilterData;

    constructor(
        private router: Router,
        private practiceService: PracticeService,
        private _mixpanelService: MixpanelService
    ) {}

    ngOnInit(): void {
        this.practiceFilterData = this.practiceService.getPracticeFilterData();
        this.getSubjectList();
        this.subjects.valueChanges.subscribe((res) => {
            res && res.length
                ? (this.filteredSubject = [])
                : (this.filteredSubject = this.subjectList);
            this.initFilter(res);
        });
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_SUB_LIST, {});
    }

    getSubjectList = () => {
        this.practiceService.getSubList({}).subscribe((response) => {
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
        this.router.navigate(['/' + RouteConstant.CHOOSE_GRADE_PRACTICE]);
    };

    onChooseGradeUrl = () => {
        this.router.navigate(['/' + RouteConstant.CHOOSE_GRADE_PRACTICE]);
    };

    onPracticeListOpen(subjectId, sName, sLogo) {
        this.practiceFilterData['subject_id'] = subjectId;
        this.practiceFilterData['subject_name'] = sName;
        this.practiceFilterData['subject_logo'] = sLogo;
        this.practiceService.setPracticeFilterData(this.practiceFilterData);
        this.router.navigate(['/' + RouteConstant.PRACTICE_LIST]);
    }

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    };
}
