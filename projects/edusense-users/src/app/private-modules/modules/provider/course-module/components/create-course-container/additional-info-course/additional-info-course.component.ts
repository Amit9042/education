import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormBaseComponent, ValidationConstant } from 'utility-lib';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { CourseService } from '../../../services';
import { SkillsModel } from '../../../models/skills.model';
import { TagModel } from '../../../models';
import { MatChipInputEvent } from '@angular/material/chips';
import { SharedService } from '@sharedModule/services';
import { RouteConstant } from '@sharedModule/constants';
import { Router } from '@angular/router';

@Component({
    selector: 'es-user-additional-info-course',
    templateUrl: './additional-info-course.component.html',
    styleUrls: ['./additional-info-course.component.scss']
})
export class AdditionalInfoCourseComponent extends FormBaseComponent
    implements OnInit {
    // Angular variables
    @ViewChild('skillInput', { static: false }) skillInput: ElementRef<
        HTMLInputElement
    >;
    @ViewChild('tagInput', { static: false }) tagInput: ElementRef<
        HTMLInputElement
    >;
    @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
    @ViewChild('autoTag', { static: false })
    matTagAutocomplete: MatAutocomplete;
    @Output() onChangeStep = new EventEmitter();
    @Input() courseId: number;

    // Constants variables
    validationMsg = new ValidationConstant();

    // Form Group variables
    skillCtrl = new FormControl();
    tagCtrl = new FormControl();

    // Data variables
    subCategoryList = [];
    tagsList = [];
    skillsList: SkillsModel[] = [];
    selectedSkillList: SkillsModel[] = [];
    selectedTagsList: TagModel[] = [];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    filteredSkills: SkillsModel[] = [];

    // State variables
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;

    constructor(
        _fb: FormBuilder,
        private courseService: CourseService,
        private sharedService: SharedService,
        private router: Router
    ) {
        super(_fb);
    }

    ngOnInit(): void {
        this.initialisation();
    }

    // Initialisation methods
    initialisation = () => {
        this.getAdditionalInformation();
        this.getTagsBasedOnSearch();
        this.getSkillsBasedOnSearch();
    };

    getAdditionalInformation = () => {
        this.getAdditionalInformationApiCall().subscribe(response => {
            this.selectedTagsList = response['payload']['tags'];
            this.selectedSkillList = response['payload']['skills'];
        });
    };

    getTagsBasedOnSearch = () => {
        this.tagCtrl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(value => {
                    this.tagsList = [];
                    return this.getTagsListApiCall(value);
                })
            )
            .subscribe(response => {
                this.tagsList = response['payload']['tags'];
            });
    };

    getSkillsBasedOnSearch = () => {
        this.skillCtrl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(value => {
                    this.skillsList = [];
                    return this.getSkillsApiCall(value);
                })
            )
            .subscribe(response => {
                this.skillsList = response['payload']['skills'];
            });
    };

    // Api Calls
    getAdditionalInformationApiCall = () => {
        return this.courseService.getAdditionalInformation(this.courseId);
    };

    getSkillsApiCall = (value: string) => {
        return this.courseService.getSkillsList({
            search: JSON.stringify({
                name: value
            }),
            rowNumber: 1,
            recordsPerPage: 20,
            sortOrder: 'asc',
            sortBy: 'name'
        });
    };

    addTagApiCall = (params: any) => {
        return this.courseService.addTag(params);
    };

    updateAdditionalInformationApiCall = (params: any) => {
        return this.courseService.updateAdditionalInformation(
            this.courseId,
            params
        );
    };

    getTagsListApiCall = (value: string) => {
        return this.courseService.getTagsList({
            search: JSON.stringify({
                name: value
            }),
            rowNumber: 1,
            recordsPerPage: 10,
            sortOrder: 'asc',
            sortBy: 'name'
        });
    };

    // Page events
    onClickSaveInfo = () => {
        this.updateAdditionalInformationApiCall({
            tags: this.selectedTagsList.map(record => record.tag_id),
            skills: this.selectedSkillList.map(record => record.skill_id)
        }).subscribe(() => {
            this.onNextStep();
        });
    };

    onPreviewStep() {
        this.onChangeStep.emit('content');
    }

    onNextStep() {
        this.onChangeStep.emit('preview');
    }

    addTag(event: MatChipInputEvent): void {
        if (
            !this.matTagAutocomplete.isOpen &&
            this.selectedTagsList.length < 5
        ) {
            const input = event.input;
            const value: string = event.value;
            let tagAlreadyAdded = this.selectedTagsList.findIndex(
                record => record.name === value
            );
            if (tagAlreadyAdded > -1) {
                this.sharedService.setSnackBar('Tag is already added!');
            } else {
                if (value) {
                    this.addTagApiCall({ name: value }).subscribe(response => {
                        this.selectedTagsList.push(response['payload']['tag']);
                    });
                }
            }
            if (input) {
                input.value = '';
            }
            this.tagCtrl.setValue('');
        }
    }

    removeSkillSelection(skill: SkillsModel): void {
        const index = this.selectedSkillList.findIndex(
            record => record.skill_id === skill.skill_id
        );

        if (index >= 0) {
            this.selectedSkillList.splice(index, 1);
        }
    }

    removeTagSelection(tag: TagModel): void {
        const index = this.selectedTagsList.findIndex(
            record => record.tag_id === tag.tag_id
        );

        if (index >= 0) {
            this.selectedTagsList.splice(index, 1);
        }
    }

    selectedSkill(event: MatAutocompleteSelectedEvent): void {
        if (this.selectedSkillList.length < 5) {
            let skill: SkillsModel = event.option.value;
            let isAlreadyAdd = this.selectedSkillList.findIndex(
                record => record.skill_id === skill.skill_id
            );
            if (isAlreadyAdd > -1) {
                this.sharedService.setSnackBar('Skill is already added!');
            } else {
                this.selectedSkillList.push(skill);
                this.skillInput.nativeElement.value = '';
                this.skillCtrl.setValue('');
            }
        }
    }

    selectedTag(event: MatAutocompleteSelectedEvent): void {
        if (this.selectedTagsList.length < 5) {
            let tag: TagModel = event.option.value;
            let isAlreadyAdd = this.selectedTagsList.findIndex(
                record => record.tag_id === tag.tag_id
            );
            if (isAlreadyAdd > -1) {
                this.sharedService.setSnackBar('Tag is already added!');
            } else {
                this.selectedTagsList.push(event.option.value);
                this.tagInput.nativeElement.value = '';
                this.tagCtrl.setValue('');
            }
        }
    }

    onCourseList = () => {
        this.router.navigate(['/' + RouteConstant.COURSE_LIST]);
    };
}
