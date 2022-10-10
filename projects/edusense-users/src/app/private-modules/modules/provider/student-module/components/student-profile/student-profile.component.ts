import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationMessageDialogComponent } from '@sharedModule/components';
import { RouteConstant, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../service';
import { StudentDetail } from '../../models';
import { SharedService } from '@sharedModule/services';
import { userAllowed } from '@sharedModule/functions';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-student-profile',
    templateUrl: './student-profile.component.html',
    styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
    // variables
    studUuid: string;
    student: StudentDetail;
    providerId: number;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private _route: ActivatedRoute,
        private _studentService: StudentService,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService
    ) {}

    ngOnInit() {
        const config = this._sharedService.getUserConfig();
        if (config) {
            this.providerId = config['provider_list'][0]['provider_id'];
        }
        this._route.paramMap.subscribe(params => {
            this.studUuid = params['params']['id'];
            this.getStudDetail();
        });
        this._mixpanelService.track(MIXPANEL_EVENTS.STUDENT_DETAIL, {});
    }

    getStudDetail() {
        const param = { provider_id: this.providerId };
        this._studentService.getDetails(param, this.studUuid).subscribe(res => {
            this.handleDetail(res['payload']);
        });
    }

    removeStudnet() {
        const param = { provider_id: this.providerId };
        this._studentService
            .removeStudent(param, this.studUuid)
            .subscribe(res => {
                this.onStudentsPage();
            });
    }

    handleDetail = data => {
        this.student = data['user'];
        this.student.class = data['class'];
        this.student.parent_class = data['parent_class'];
    };

    onOpenConfirmationDialog() {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Confirmation',
                caption:
                    'Are you sure you want to remove ' +
                    this.student.user.first_name +
                    ' ' +
                    this.student.user.last_name +
                    ' from the institute?',
                primaryButtonLabel: 'Remove Student',
                secondaryButtonLabel: 'Cancel'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeStudnet();
            }
        });
    }

    onStudentsPage() {
        this.router.navigate(['/' + RouteConstant.STUDENT_MODULE_ROUTE]);
    }

    getLocation = () => {
        let locationName = '';
        if (this.student.student_city) {
            locationName += this.student.student_city.city_name;
        }
        if (this.student.student_state) {
            locationName ? (locationName += ', ') : '';
            locationName += this.student.student_state.state_name;
        }
        if (this.student.student_country) {
            locationName ? (locationName += ', ') : '';
            locationName += this.student.student_country.country_name;
        }
        return locationName;
    };

    onError = event => {
        event.target.src = 'assets/images/svg_files/studentProfile.svg';
    };
}
