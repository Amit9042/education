import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouteConstant, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { MaterialService } from '../../service';
import { MaterialSubject } from '@sharedModule/models';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-subject-selection',
    templateUrl: './subject-selection.component.html',
    styleUrls: ['./subject-selection.component.scss']
})
export class SubjectSelectionComponent implements OnInit {
    subjects = new FormControl();

    subjectList: MaterialSubject[] = [];
    filteredSubject: MaterialSubject[] = [];
    materialFilterData;

    constructor(private router: Router,
        private materialService: MaterialService,
        private _mixpanelService: MixpanelService) {}

    ngOnInit(): void {
        this.materialFilterData = this.materialService.getMaterialFilterData();
        this.getSubjectList();
        this.subjects.valueChanges.subscribe(res => {
            res && res.length ? this.filteredSubject = [] : this.filteredSubject = this.subjectList;
            this.initFilter(res)
        });
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_SUB_LIST, {});
    }

    getSubjectList = () => {
        this.materialService.getSubList({}).subscribe(response => {
            this.subjectList = response.payload;
            this.filteredSubject = this.subjectList;
        })
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

    onGradeUrl = () => {
        this.router.navigate(['/' + RouteConstant.GRADE_SELECTION]);
    };

    onMaterialSelection = (subjectId,sName) => {
        
        this.materialFilterData['subject_id'] = subjectId;
        this.materialFilterData['subject_name'] = sName;
        this.materialService.setMaterialFilterData(this.materialFilterData);
        this.router.navigate(['/' + RouteConstant.MATERIAL_SELECTION]);
    };

    onError = event => {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    };
}
