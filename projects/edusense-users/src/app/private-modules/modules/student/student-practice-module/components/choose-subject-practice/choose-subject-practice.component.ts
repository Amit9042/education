import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { MaterialSubject } from '../../../student-material-module/models';
import { FormControl } from '@angular/forms';
import { EnterpriseDetail } from '../../../../../../public-modules/models';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-choose-subject-practice',
    templateUrl: './choose-subject-practice.component.html',
    styleUrls: ['./choose-subject-practice.component.scss']
})
export class ChooseSubjectPracticeComponent implements OnInit {
    // Data variables
    subjectList: MaterialSubject[] = [];
    filteredSubject: MaterialSubject[] = [];
    enterpriseList: EnterpriseDetail[] = [];

    // FormControl variables
    subjects = new FormControl();

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.enterpriseList = this.sharedService.getUserConfig().enterprise;
        this.routeSubscriber();
        this.subjects.valueChanges.subscribe((res) => {
            res && res.length
                ? (this.filteredSubject = [])
                : (this.filteredSubject = this.subjectList);
            this.initFilter(res);
        });
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.subjectList) {
                resolvedData.subjectList.forEach((classList) => {
                    classList.class_subject_link.forEach((element) => {
                        let subject: any = {};
                        subject['subject_id'] = element.subject_id;
                        subject['name'] = element.subject_master.name;
                        subject['description'] =
                            element.subject_master.description;
                        subject['logo'] = element.subject_master.logo;
                        this.subjectList.push(subject);
                    });
                });
                // this.subjectList = resolvedData.subjectList;
                this.filteredSubject = this.subjectList;
            }
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

    // Page events
    onPracticeListOpen(subject: MaterialSubject) {
        this.router.navigate([
            '/' + RouteConstant.PRACTICE_CHAPTER_STUDENT,
            subject.subject_id
        ]);
    }

    // Helper methods
    onError = (event) => {
        event.target.src = 'assets/images/svg_files/userProfile.svg';
    };
}
