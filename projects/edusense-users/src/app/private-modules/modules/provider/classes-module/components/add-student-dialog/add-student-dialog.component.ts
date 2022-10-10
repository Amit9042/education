import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    Component,
    ElementRef,
    ViewChild,
    OnInit,
    Inject
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {
    MatAutocompleteSelectedEvent,
    MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of, throwError } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap
} from 'rxjs/operators';
import { FormBaseComponent } from '@sharedModule/components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassesService } from '../../service';
import { SearchStudentForClassModel } from '../../../../../models';
import { ParentClassesService } from '../../../parent-classes-module/service';

@Component({
    selector: 'app-add-student-dialog',
    templateUrl: './add-student-dialog.component.html',
    styleUrls: ['./add-student-dialog.component.scss']
})
export class AddStudentDialogComponent extends FormBaseComponent
    implements OnInit {
    // Angular variables
    @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    // Form Group variables
    addStudentForm: FormGroup;

    // Other variables
    separatorKeysCodes: number[] = [ENTER, COMMA];
    studentCtrl = new FormControl();
    filteredStudents: Observable<SearchStudentForClassModel[]>;
    selectedStudentNames: string[] = [];
    selectedStudentIds: number[] = [];
    isParentClass;

    constructor(
        _fb: FormBuilder,
        protected classesService: ClassesService,
        protected parentClassesService: ParentClassesService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddStudentDialogComponent>
    ) {
        super(_fb);
    }

    ngOnInit() {
        this.isParentClass = this.data['isParent'];
        this.intialize();
    }

    intialize = () => {
        this.createStudentForm();
        this.filteredStudents = this.studentCtrl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => {
                if (value) {
                    return this._filterStudents(value);
                } else {
                    return of([]);
                }
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    };

    private _filterStudents(value: string): Observable<any[]> {
        if (this.isParentClass) {
            const params = {
                parent_class_id: this.data.parentClassId,
                search: JSON.stringify({ name: value })
            };
            return this.parentClassesService
                .getStudentListForParentClass(params)
                .pipe(
                    map(response => {
                        const students = [];
                        for (const student of response.payload) {
                            if (
                                this.selectedStudentIds.indexOf(
                                    student.student.user_details.user_id
                                ) === -1
                            ) {
                                students.push(student);
                            }
                        }
                        return students;
                    }),
                    catchError(error => {
                        return throwError(error);
                    })
                );
        } else {
            const params = {
                class_id: this.data.class_id,
                search: JSON.stringify({ name: value })
            };
            return this.classesService.getStudentListForClass(params).pipe(
                map(response => {
                    const students = [];
                    for (const student of response.payload) {
                        if (
                            this.selectedStudentIds.indexOf(
                                student.student.user_details.user_id
                            ) === -1
                        ) {
                            students.push(student);
                        }
                    }
                    return students;
                }),
                catchError(error => {
                    return throwError(error);
                })
            );
        }
    }

    createStudentForm = () => {
        this.addStudentForm = this.createForm({
            class_id: this.isParentClass ? this.data.parentClassId : this.data.class_id,
            assign_session: ['true'],
        });
    };

    onSubmitStudentForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            if (this.isParentClass) {
                let params = form.value;
                params['parent_class_id'] = params['class_id'];
                delete params['class_id'];
                params['user_ids'] = this.selectedStudentIds;
                this.parentClassesService
                    .addStudentInParentClass(params)
                    .subscribe(response => {
                        this.onDialogClose();
                    });
            } else {
                const params = form.value;
                params['user_ids'] = this.selectedStudentIds;
                this.classesService
                    .addStudentInClass(params)
                    .subscribe(response => {
                        this.onDialogClose();
                    });
            }
        }
    };

    remove(index: number): void {
        this.selectedStudentIds.splice(index, 1);
        this.selectedStudentNames.splice(index, 1);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const student: SearchStudentForClassModel = event.option.value;
        // tslint:disable-next-line:max-line-length
        const name = `${student.student.user_details.first_name} ${student.student.user_details.last_name}`;
        this.selectedStudentIds.push(student.student.user_details.user_id);
        this.selectedStudentNames.push(name);
        this.studentInput.nativeElement.value = '';
        this.studentCtrl.setValue(null);
    }

    onDialogClose(): void {
        this.dialogRef.close();
    }
}
