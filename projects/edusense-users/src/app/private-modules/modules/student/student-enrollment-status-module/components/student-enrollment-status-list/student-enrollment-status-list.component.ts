import {Component, OnInit} from '@angular/core';
import {StudentEnrollService} from '../../../../../services';
import {EnrollStatusEnum, PAGE_SIZE_OPTIONS, ViewType, MIXPANEL_EVENTS} from '@sharedModule/constants';
import {EnrollmentStudentModel} from '../../../../../models';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, startWith} from 'rxjs/operators';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
  selector: 'app-student-enrollment-status-list',
  templateUrl: './student-enrollment-status-list.component.html',
  styleUrls: ['./student-enrollment-status-list.component.scss']
})
export class StudentEnrollmentstatusListComponent implements OnInit {

  // view type
  viewType = ViewType;
  currentViewType = ViewType.Loading;

  // Search Formcontrol
  searchControl = new FormControl();

  // Datasourse variables
  enrolmentList: EnrollmentStudentModel[] = [];
  enrollStatusEnum = EnrollStatusEnum;

  // Pagination related variables
  totalElements = 0;
  recordsPerPage = PAGE_SIZE_OPTIONS[0];
  rowNumber = 1;

  constructor(protected studentEnrollService: StudentEnrollService,
    private _mixpanelService: MixpanelService) {
  }

  ngOnInit() {
    this.initialise();
    this._mixpanelService.track(MIXPANEL_EVENTS.ENROLLMENT_STATUS_VIEW, {});
  }

  initialise() {
    this.initSearchControl();
  }

  initSearchControl() {
    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.getEnrolmentList();
      });
  }

  getEnrolmentList() {
    const params = {
      showAll: false,
      rowNumber: this.rowNumber,
      recordsPerPage: this.recordsPerPage
    };
    if (this.searchControl.value) {
      params['search'] = JSON.stringify({name: this.searchControl.value});
    }
    this.currentViewType = ViewType.Loading;
    this.studentEnrollService.enrollmentList(params).subscribe(response => {
      this.enrolmentList = response.payload;
      this.totalElements = response.pager['totalRecords'];
      this.currentViewType = this.enrolmentList.length
        ? ViewType.Data
        : ViewType.NoData;
    });
  }

  // Page Events
  onChangePagination = params => {
    this.rowNumber = +params['rowNumber'];
    this.recordsPerPage = +params['recordsPerPage'];
    this.getEnrolmentList();
  }
}
