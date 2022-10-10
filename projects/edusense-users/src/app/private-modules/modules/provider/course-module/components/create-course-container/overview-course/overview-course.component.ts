import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBaseComponent, SelectSearchModel } from 'utility-lib';
import {
    FileSizeEnum,
    RouteConstant,
    ValidationConstant
} from '@sharedModule/constants';
import { Router } from '@angular/router';
import { CourseService } from '../../../services';
import {
    CourseCategoryModel,
    CourseModel,
    LanguageModel
} from '../../../models';
import { isValidImageType, removeEmptyFields } from '@sharedModule/functions';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-overview-course',
    templateUrl: './overview-course.component.html',
    styleUrls: ['./overview-course.component.scss']
})
export class OverviewCourseComponent extends FormBaseComponent
    implements OnInit, OnChanges {
    @Output() onChangeStep = new EventEmitter();
    @Output() onCallCourseDetails = new EventEmitter();
    @Input() courseId: number;
    @Input() courseDetails: CourseModel;
    @Input() languageList: LanguageModel[] = [];

    // Constants variables
    validationMsg = new ValidationConstant();

    // Form Group variables
    overviewCourseForm: FormGroup;

    // Config variables
    languageSearchConfig: SelectSearchModel = {
        displayLabel: 'Instruction Language',
        controlName: 'selectLanguage',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Instruction Language',
        selectPlaceholderLabel: 'Search Instruction Language',
        isRequired: false,
        validationMsg: '',
        selectMulti: false,
        selectedValueCompairId: 'language_id'
    };

    // Data variables
    categoryList = [];
    subCategoryList = [];
    filteredCategory: CourseCategoryModel[] = [];
    filteredSubCategory: CourseCategoryModel[] = [];
    uploadImage = [];
    imageUploadDetails: any;
    fileName: string;
    selectedLanguage: LanguageModel;

    // state variables
    isLoading = false;

    constructor(
        _fb: FormBuilder,
        private router: Router,
        private courseService: CourseService,
        private sharedService: SharedService
    ) {
        super(_fb);
    }

    ngOnInit(): void {
        this.initialisation();
    }

    ngOnChanges() {
        this.createOverviewCourseForm();
        if (this.courseDetails) {
            this.patchFormValue();
            this.selectedLanguage = this.languageList.find(
                lang =>
                    lang.language_id === this.courseDetails.language.language_id
            );
            if (this.courseDetails.cover_image) {
                this.imageUploadDetails = this.courseDetails.cover_image;
            }
        }
    }

    // Initialisation methods
    initialisation = () => {
        this.getCategoriesValueChange();
        this.getSubCategoriesValueChange();
    };

    createOverviewCourseForm = () => {
        this.overviewCourseForm = this.createForm({
            description: [
                '',
                [Validators.minLength(2), Validators.maxLength(2000)]
            ],
            categoryInput: [''],
            categoryName: [''],
            categoryId: [''],
            subCategoryInput: [''],
            subCategoryName: [''],
            subCategoryId: [''],
            selectLanguage: ['']
        });
    };

    patchFormValue = () => {
        this.overviewCourseForm.patchValue({
            description: this.courseDetails.description,
            categoryInput: this.courseDetails.course_category
                ? this.courseDetails.course_category.parent_category
                    ? this.courseDetails.course_category.parent_category.name
                    : this.courseDetails.course_category.name
                : '',
            categoryName: this.courseDetails.course_category
                ? this.courseDetails.course_category.parent_category
                    ? this.courseDetails.course_category.parent_category.name
                    : this.courseDetails.course_category.name
                : '',
            categoryId: this.courseDetails.course_category
                ? this.courseDetails.course_category.parent_category
                    ? this.courseDetails.course_category.parent_category
                          .category_id
                    : this.courseDetails.course_category.category_id
                : '',
            subCategoryInput: this.courseDetails.course_category
                ? this.courseDetails.course_category.parent_category
                    ? this.courseDetails.course_category.name
                    : ''
                : '',
            subCategoryName: this.courseDetails.course_category
                ? this.courseDetails.course_category.parent_category
                    ? this.courseDetails.course_category.name
                    : ''
                : '',
            subCategoryId: this.courseDetails.course_category
                ? this.courseDetails.course_category.parent_category
                    ? this.courseDetails.course_category.category_id
                    : ''
                : ''
        });
    };

    getCategoriesValueChange = () => {
        this.overviewCourseForm
            .get('categoryInput')
            .valueChanges.pipe(
                debounceTime(300),
                tap(() => (this.isLoading = true)),
                switchMap(value => {
                    this.filteredCategory = [];
                    if (this.formControls['categoryName'].value !== value) {
                        this.formControls['categoryId'].reset();
                    }
                    return this.formControls['categoryName'].value !== value
                        ? this.categoryListApiCall(value)
                        : of(this.filteredCategory);
                })
            )
            .subscribe(response => {
                this.filteredCategory =
                    response.constructor === Object
                        ? response['payload']['categories']
                        : response;
            });
    };

    getSubCategoriesValueChange = () => {
        this.overviewCourseForm
            .get('subCategoryInput')
            .valueChanges.pipe(
                debounceTime(300),
                tap(() => (this.isLoading = true)),
                switchMap(value => {
                    this.filteredSubCategory = [];
                    if (this.formControls['subCategoryName'].value !== value) {
                        this.formControls['subCategoryId'].reset();
                    }
                    return this.formControls['subCategoryName'].value !==
                        value && this.formControls['categoryId'].value
                        ? this.subCategoryListApiCall(value)
                        : of(this.filteredSubCategory);
                })
            )
            .subscribe(response => {
                this.filteredSubCategory =
                    response.constructor === Object
                        ? response['payload']['categories']
                        : response;
            });
    };

    // Api calls
    categoryListApiCall = (value: string) => {
        return this.courseService.getCategoriesList({
            search: JSON.stringify({ name: value, parentOnly: 1, status: 1 }),
            rowNumber: 1,
            recordsPerPage: 20,
            sortOrder: 'asc',
            sortBy: 'name'
        });
    };

    subCategoryListApiCall = (value: string) => {
        return this.courseService.getCategoriesList({
            search: JSON.stringify({
                name: value,
                parentCategory: this.formControls['categoryId'].value,
                status: 1
            }),
            rowNumber: 1,
            recordsPerPage: 20,
            sortOrder: 'asc',
            sortBy: 'name'
        });
    };

    updateCourseApiCall = (params: any) => {
        return this.courseService.updateCourse(
            this.courseId,
            params,
            this.uploadImage
        );
    };

    // Page events
    getSubCategoryList = () => {
        this.subCategoryListApiCall('').subscribe(response => {
            this.filteredSubCategory = response['payload']['categories'];
        });
    };

    onSelectChangeEvent(event, flag) {
        this.formControls[flag].setValue(event);
    }

    onSubmitCourseOverviewForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            let params = removeEmptyFields(form.value);
            if (
                params['selectLanguage'] &&
                params['selectLanguage']['language_id']
            ) {
                params['language'] = params['selectLanguage']['language_id'];
                delete params['selectLanguage'];
            }
            if (this.formControls['subCategoryId'].value) {
                params['category'] = this.formControls['subCategoryId'].value;
            } else if (this.formControls['categoryId'].value) {
                params['category'] = this.formControls['categoryId'].value;
            }
            params['title'] = this.courseDetails.title;
            this.updateCourseApiCall(params).subscribe(response => {
                this.onChangeStep.emit('content');
                this.onCallCourseDetails.emit(true);
            });
        }
    };

    onSelectCategory = (category: CourseCategoryModel) => {
        if (category instanceof Object && category.category_id) {
            this.formControls['categoryName'].setValue(category.name);
            this.formControls['categoryId'].setValue(category.category_id);
            this.getSubCategoryList();
        }
    };

    onSelectSubCategory = (sub: CourseCategoryModel) => {
        if (sub instanceof Object && sub.category_id) {
            this.formControls['subCategoryName'].setValue(sub.name);
            this.formControls['subCategoryId'].setValue(sub.category_id);
        }
    };

    onFileUpload = event => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isValidImageType(event.target.files[0].type)) {
                if (
                    event.target.files[0].size > FileSizeEnum.TEN_MB_IMAGE_SIZE
                ) {
                    this.sharedService.setSnackBar(
                        'File size is greater then 10 MB.'
                    );
                    event.target.value = null;
                } else {
                    this.uploadImage = [];
                    const reader = new FileReader();
                    reader.onloadend = (loadEvent: any) => {
                        this.imageUploadDetails = loadEvent.target.result;
                        this.fileName = file.name;
                        this.uploadImage.push({
                            reqKey: 'image',
                            files: event.target.files
                        });
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                this.sharedService.setSnackBar('Please select the valid file.');
                event.target.value = null;
            }
        }
    };

    onCancelImage = () => {
        this.fileName = null;
        this.imageUploadDetails = null;
        this.uploadImage = [];
    };

    onBrowseFile(id) {
        document.getElementById(id).click();
    }

    onCourseList = () => {
        this.router.navigate(['/' + RouteConstant.COURSE_LIST]);
    };

    // Helpers
    get formControls() {
        return this.overviewCourseForm.controls;
    }
}
