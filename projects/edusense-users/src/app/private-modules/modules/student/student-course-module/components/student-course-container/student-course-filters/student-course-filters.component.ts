import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { CourseCategoryModel, CourseLanguageModel } from 'edusense-users/src/app/private-modules/modules/provider/course-module/models';
import { CourseService } from 'edusense-users/src/app/private-modules/modules/provider/course-module/services';
import { merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isNumber } from 'util';
import { FormBaseComponent, SelectSearchModel } from 'utility-lib';

export const FilterFormEnum = {
    titleCtrl: 'titleCtrl',
    language: 'language',
    durationCtrl: 'durationCtrl',
    category: 'category'
}
@Component({
    selector: 'es-user-student-course-filters',
    templateUrl: './student-course-filters.component.html',
    styleUrls: ['./student-course-filters.component.scss']
})
export class StudentCourseFiltersComponent
    extends FormBaseComponent
    implements OnInit, OnChanges {

    // constatnt Variable
    filterFormEnum = FilterFormEnum;

    // FormGroup Variables
    studentCourseFiltersForm: FormGroup;

    // Config variables
    languageSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: this.filterFormEnum.language,
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search language',
        selectPlaceholderLabel: 'Language',
        isRequired: false,
        validationMsg: '',
        selectMulti: false,
        isClearRequired: true
    };

    categorySearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: this.filterFormEnum.category,
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search category',
        selectPlaceholderLabel: 'Category',
        isRequired: false,
        validationMsg: '',
        selectMulti: true,
    };

    durationSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: this.filterFormEnum.durationCtrl,
        keyPath: 'label',
        searchKey: 'label',
        searchPlaceholderLabel: 'Select Duration',
        selectPlaceholderLabel: 'Duration',
        isRequired: false,
        validationMsg: '',
        selectMulti: false,
        isClearRequired: true
    };

    // Data variables
    languageList = [];
    subCategoryList = [];
    durationList = [
        { label: '0 - 2  Hours', value: { minHours: 0, maxHours: 7200 } },
        { label: '2 - 5  Hours', value: { minHours: 7200, maxHours: 18000 } },
        { label: '5 - 10 Hours', value: { minHours: 18000, maxHours: 36000 } },
        { label: '10 -20 Hours', value: { minHours: 36000, maxHours: 72000 } }
    ]

    @Input() parentCategoryId = null;
    @Output() filterParamChangedEvent = new EventEmitter<any>();



    constructor(fb: FormBuilder,
        private courseService: CourseService) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.createStudentCourseFiltersForm();
        this.getLanguageList();

        merge(
            this.formControls[this.filterFormEnum.titleCtrl].valueChanges,
            this.formControls[this.filterFormEnum.language].valueChanges,
            this.formControls[this.filterFormEnum.durationCtrl].valueChanges,
            this.formControls[this.filterFormEnum.category].valueChanges
        ).pipe(
            debounceTime(300))
            .subscribe(() => {
                this.filterParamChangedEvent.emit(this.queryParams());
            });
    }

    getLanguageList() {
        const params = {
            rowNumber: 1,
            recordsPerPage: 1000,
            sortOrder: 'asc',
            sortBy: 'name'
        }
        this.courseService.getLanguageList(params).subscribe((resonse) => {
            this.languageList = resonse.payload.languages;
        });
    }

    getCategoryList() {
        let searchParam = { status: 1 }
        if (isNumber(this.parentCategoryId)) {
            this.categorySearchConfig.searchPlaceholderLabel = 'Search sub category';
            this.categorySearchConfig.selectPlaceholderLabel = 'Sub Category';
            searchParam['parentCategory'] = this.parentCategoryId;
        } else {
            this.categorySearchConfig.searchPlaceholderLabel = 'Search category';
            this.categorySearchConfig.selectPlaceholderLabel = 'Category';
            searchParam['parentOnly'] = 1;
        };
        const params = {
            search: JSON.stringify(searchParam),
            sortBy: 'name',
            sortOrder: 'asc'
        }
        this.courseService.getCategoriesList(params).subscribe((response) => {
            if (response) {
                this.subCategoryList = response.payload.categories;
            }
        })
    }

    createStudentCourseFiltersForm = () => {
        this.studentCourseFiltersForm = this.createForm({
            titleCtrl: null,
            language: null,
            durationCtrl: null,
            category: null
        });
    };

    onSelectLanguageChangeEvent(form) {
    }

    onSelectCategory(event) {
    }

    get formControls() {
        return this.studentCourseFiltersForm.controls;
    }

    get searchField(): AbstractControl {
        return this.studentCourseFiltersForm.get(this.filterFormEnum.titleCtrl).value;
    }

    get languageField(): CourseLanguageModel {
        return this.studentCourseFiltersForm.get(this.filterFormEnum.language).value;
    }

    get categoryField(): CourseCategoryModel[] {
        return this.studentCourseFiltersForm.get(this.filterFormEnum.category).value;
    }

    get durationField(): { label: any, value: { minHours: number, maxHours: number } } {
        return this.studentCourseFiltersForm.get(this.filterFormEnum.durationCtrl).value;
    }

    queryParams = () => {
        let params = {};
        const catArray = this.categoryField?.map(e => e.category_id);
        if (this.searchField) {
            params['title'] = this.searchField;
        }
        if (this.languageField && !(this.languageField instanceof Array)) {
            params['language'] = this.languageField.language_id;
        }
        if (catArray.length) {
            params['categories'] = catArray;
        } else if (this.parentCategoryId) {
            params['categories'] = [this.parentCategoryId];
        }

        if (this.durationField?.value) {
            params['minHours'] = this.durationField.value?.minHours;
            params['maxHours'] = this.durationField.value?.maxHours;
        }
        return params;
    };

    ngOnChanges() {
        if (this.studentCourseFiltersForm) {
            this.studentCourseFiltersForm.reset();
        }
        this.getCategoryList();
    }
}
