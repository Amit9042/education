import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouteConstant, MIXPANEL_EVENTS, HttpStatus, AppMessageConstants } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { MaterialService } from '../../service';
import { MaterialSubject } from '../../models';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'app-student-subject-selection',
    templateUrl: './student-subject-selection.component.html',
    styleUrls: ['./student-subject-selection.component.scss']
})
export class StudentSubjectSelectionComponent implements OnInit {
    subjects = new FormControl();
    subjectList: MaterialSubject[] = [];
    filteredSubject: MaterialSubject[] = [];
    providerUUID: string;
    isNotAdmitted: boolean = false;
    notAdmittedMsg: string;

    constructor(private router: Router,
        private materialService: MaterialService,
        private _mixpanelService: MixpanelService,
        private _sharedService: SharedService) {}

    ngOnInit(): void {
        this.providerUUID = this._sharedService.getActiveEnterprise().provider_uuid;
        this.notAdmittedMsg = AppMessageConstants.NOT_ADMITTED;
        if (this.providerUUID) {
            this.getSubjectList();
        }
        this.subjects.valueChanges.subscribe(res => {
            res && res.length ? this.filteredSubject = [] : this.filteredSubject = this.subjectList;
            this.initFilter(res)
        });
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_SUB_LIST_STUD, {});
    }

    getSubjectList = () => {
        const params = {
            is_total_count:1,
            providerUUID: this.providerUUID
        }
        this.materialService.getSubList(params).subscribe(response => {
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

    onMaterialSelection = (subjectId,sName) => {
        this.materialService.setMaterialFilterData({'subject_id': subjectId,'subject_name':sName});
        this.router.navigate(['/' + RouteConstant.STUDENT_MATERIAL_LIST]);
    };

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/userProfile.svg';
    };
}
