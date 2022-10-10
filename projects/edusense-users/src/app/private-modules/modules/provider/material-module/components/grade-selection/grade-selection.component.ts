import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouteConstant, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { MaterialService } from '../../service';
import { MaterialGrade } from '@sharedModule/models';
import { userAllowed } from '@sharedModule/functions';
import { SharedService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-grade-selection',
    templateUrl: './grade-selection.component.html',
    styleUrls: ['./grade-selection.component.scss']
})
export class GradeSelectionComponent implements OnInit {
    // static variable
    isGradeSelected = false;

    grades = new FormControl();
    gradeList: MaterialGrade[] = [];
    filteredGrade: MaterialGrade[] = [];

    constructor(private router: Router,
        private materialService: MaterialService,
        private sharedService:SharedService,
        private _mixpanelService: MixpanelService) {}

    ngOnInit(): void {
        this.getGradeList();
        this.grades.valueChanges.subscribe(res => {
            res && res.length ? this.filteredGrade = [] : this.filteredGrade = this.gradeList;
            this.initFilter(res)
        });
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_GRADE_LIST, {});
    }

    getGradeList = () => {
        this.materialService.getGradeList({}).subscribe(response => {
            this.gradeList = response.payload;
            this.filteredGrade = this.gradeList;
        })
    }

    initFilter = (selectedGrades) => {
        this.gradeList.forEach(element => {
            selectedGrades.forEach(selectedElement => {
                if (element.grade_id === selectedElement.grade_id) {
                    this.filteredGrade.push(selectedElement);
                }
            });
        })
    }

    onSubjectSelection = (gradeId,gName) => {
        const isUserAllowed = userAllowed(this.sharedService);
        if (!isUserAllowed) {
            return;
        }
        
        const filterData = { 'grade_id': gradeId,'grade_name': gName};
        this.isGradeSelected = true;
        this.materialService.setMaterialFilterData(filterData);
        this.router.navigate(['/' + RouteConstant.SUBJECT_SELECTION]);
    };
}
