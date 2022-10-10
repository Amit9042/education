import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouteConstant, PAGE_SIZE_OPTIONS, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { MatSort } from '@angular/material/sort';
import { getQueryParams } from '@sharedModule/functions/common-functions';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { startWith, switchMap, catchError, debounceTime } from 'rxjs/operators';
import { merge, throwError } from 'rxjs';
import { StudentService } from '../../service';
import { SharedUserService } from '@sharedModule/services';
import { Student } from '../../models';
import { Router } from '@angular/router';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { FormBaseComponent } from '@sharedModule/components';
import { Classes, ParentClasses } from '@sharedModule/models';
import { ClassesService } from '../../../classes-module/service';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { ParentClassesService } from '../../../parent-classes-module/service';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent extends FormBaseComponent implements OnInit {
    // Angular Variables
    // @ViewChild(MatSort, { static: true }) sort: MatSort;
    // State Variables
    isLoadingResults = true;

    // Form Variables
    nameFilterField: FormControl = new FormControl('');
    // classFilterField: FormControl = new FormControl('');
    studentSearchForm: FormGroup;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    classSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'classFilterField',
        filterControlName: 'classFilter',
        keyPath: 'class_name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search session',
        selectPlaceholderLabel: 'Select session',
        isRequired: false,
        selectMulti: true,
        selectedValueCompairId: 'class_id',
        validationMsg: ''
    };
    
    parentClassSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'parentFilter',
        filterControlName: 'parentFilterFilter',
        keyPath: 'class_name',
        searchKey: 'class_name',
        searchPlaceholderLabel: 'Search class',
        selectPlaceholderLabel: 'Select class',
        isRequired: false,
        selectMulti: true,
        selectedValueCompairId: 'parent_class_id',
        validationMsg: ''
    };

    //data variables
    dataSource: Student[] = [];
    providerId: number;
    // gradeList: any[] = [];
    classList: Classes[] = [];
    parentClassList: ParentClasses[] = [];

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private _sharedUserService: SharedUserService,
        private _studentService: StudentService,
        private _classesService: ClassesService,
        private _parentClassesService: ParentClassesService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.initialize();
        const config = this._sharedUserService.getUserConfig();
        if (config) {
            this.providerId = config['provider_list'][0]['provider_id'];
        }
        this.initializeMethod();
        this.getClassList();
        this.getParentClassList();
        this._mixpanelService.track(MIXPANEL_EVENTS.STUDENT_ADD_VIEW, {});
    }

    initialize = () => {
        this.createStudentSearchForm();
    };

    createStudentSearchForm = () => {
        this.studentSearchForm = this.createForm({
            classFilterField: [''],
            parentFilter: ['']
        });
    };

    detailPage(uuid) {
        this.router.navigate([
            '/' + RouteConstant.PROVIDER_STUDENT_VIEW,
            uuid
        ]);
    }

    openViewDialog(): void {
        // const dialogRef = this.dialog.open(PrescriptionPdfComponent, {
        //   panelClass: 'prescription-view-dialog-container',
        //   data: {}
        // });
        // dialogRef.afterClosed().subscribe(result => {
        // });
    }

    initializeMethod = () => {
        this.isLoadingResults = true;
        merge(
            this.nameFilterField.valueChanges,
            this.formControls['parentFilter'].valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    return this.getList();
                }),
                catchError(error => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe(response => {
                this.handleList(response['payload'], response['pager']);
            });
    };

    getList = () => {
        return this._studentService.listStudent({
            provider_id: this.providerId,
            ...getQueryParams(
                this.getSearchParams(),
                null,
                this.rowNumber,
                this.recordsPerPage
            )
        });
    };

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.getStudentList();
    };

    getStudentList = () => {
        this.getList().subscribe(response => {
            this.handleList(response['payload'], response['pager']);
        });
    };

    getSearchParams() {
        const params = {};
        if (this.nameFilterField.value) {
            params['name'] = this.nameFilterField.value;
        }
        if (
            this.formControls['parentFilter'].value &&
            this.formControls['parentFilter'].value.length > 0
        ) {
            params['parent_class_id'] = this.formControls[
                'parentFilter'
            ].value.map(e => e.parent_class_id);
        }
        return params;
    }

    handleList = (list, pager) => {
        this.dataSource = list;
        this.totalElements = pager['totalRecords'];
        this.isLoadingResults = false;
    };

    getLocation = (index: number) => {
        let locationName = '';
        if (
            this.dataSource[index]
                .student_city
        ) {
            locationName += this.dataSource[index]
                .student_city.city_name;
        }
        if (
            this.dataSource[index]
                .student_state
        ) {
            locationName ? (locationName += ', ') : '';
            locationName += this.dataSource[index]
                .student_state.state_name;
        }
        if (
            this.dataSource[index]
                .student_country
        ) {
            locationName ? (locationName += ', ') : '';
            locationName += this.dataSource[index]
                .student_country.country_name;
        }
        return locationName;
    };

    getClassList = () => {
        this._classesService
            .listClass({
                provider_id: this.providerId,
                ...getQueryParams({}, null, 1, 100, true)
            })
            .subscribe(res => {
                this.classList = res['payload'];
            });
    };

    onError = event => {
        event.target.src = 'assets/images/svg_files/studentProfile.svg';
    };

    //autocomplete fields
    onSelectChangeEvent(event, type) {
        this.formControls[type].setValue(event);
    }

    // Helpers
    get formControls() {
        return this.studentSearchForm.controls;
    }

    getParentClassList = () => {
        this._parentClassesService
            .listParentClass({
                provider_id: this.providerId,
                ...getQueryParams(
                    { },
                    null,
                    1,
                    100,
                    true
                )
            })
            .subscribe(res => {
                this.parentClassList = res['payload'];
            });
    }
}
