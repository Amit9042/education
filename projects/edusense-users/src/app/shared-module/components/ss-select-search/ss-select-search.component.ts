import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormBaseComponent } from '../form-base/form-base.component';

@Component({
    selector: 'app-ss-select-search',
    templateUrl: './ss-select-search.component.html',
    styleUrls: ['./ss-select-search.component.scss']
})
export class SelectSearchComponent extends FormBaseComponent
    implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    // Angular Variables
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    // Data Variables
    @Input() selectConfig;
    @Input() formName;
    @Input() dataList = [];
    @Input() selected = [];
    @Output() changSelectEvent = new EventEmitter<any>();

    // Form Control
    selectSearchForm: FormGroup;
    filteredData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    _onDestroy = new Subject<void>();

    selectedElementValue = null; //added for close button

    constructor(_fb: FormBuilder) {
        super(_fb);
    }

    ngOnInit() {
        this.initialization();
    }

    ngAfterViewInit() {
        this.setInitialValue();
    }

    initialization() {
        this.createSearchForm();
    }

    createSearchForm() {
        this.formName.registerControl(
            this.selectConfig?.filterControlName,
            new FormControl('')
        );
        this.filteredData.next(this.dataList.slice());

        // listen for search field value changes
        this.formName.controls[
            this.selectConfig?.filterControlName
        ].valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterData();
            });
        this.selectedValue();
        this.disableControl();
    }

    ngOnChanges() {
        this.createSearchForm();
        this.setInitialValue();
    }

    selectedValue() {
        if (this.selected && this.selectConfig && this.formName) {
            if (this.selectConfig.selectMulti) {
                const arry = [];
                this.dataList.forEach(e1 =>
                    this.selected.forEach(e2 => {
                        if (
                            e1[this.selectConfig.selectedValueCompairId] ===
                            e2[this.selectConfig.selectedValueCompairId]
                        ) {
                            arry.push(e1);
                        }
                    })
                );

                this.formName
                    .get(this.selectConfig.controlName)
                    .patchValue(arry);
            } else {
                this.formName
                    .get(this.selectConfig.controlName)
                    .patchValue(this.selected);
            }
        }
    }

    // For Disable formcontrol
    disableControl() {
        if (this.selectConfig.isDisabled) {
            this.formName.get(this.selectConfig.controlName).disable();
        }
    }

    // Action Method
    onSelectChange(data) {
        //  this.formName.get(this.selectConfig.controlName).patchValue(data.value);
        this.selectedElementValue = data.value;
        this.changSelectEvent.emit(data.value);
    }

    removeSelectedData() {
        this.selectedElementValue = null;
        this.formControls[this.selectConfig.controlName].reset();
        // here we can emite removed event in future (if needed). 
    }

    // Help methods
    setInitialValue() {
        this.filteredData
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.singleSelect.compareWith = (a: any, b: any) =>
                    a && b && a === b;
            });
    }

    filterData() {
        if (!this.dataList) {
            return;
        }
        // get the search keyword
        let search = this.formName.controls[this.selectConfig.filterControlName]
            .value;
        if (!search) {
            this.filteredData.next(this.dataList.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }
        this.filteredData.next(
            this.dataList.filter(
                data =>
                    data[this.selectConfig.searchKey]
                        .toLowerCase()
                        .indexOf(search) > -1
            )
        );
    }

    getColumnValue(elem: any, keyName: string) {
        if (Array.isArray(keyName)) {
            const value = [];
            keyName.forEach((item, index) => {
                value[index] = this.getValueForKeyPath(elem, item);
            });
            return value.join(' ');
        } else {
            return this.getValueForKeyPath(elem, keyName);
        }
    }

    getValueForKeyPath(elem, keyName) {
        const keys = keyName.split('.');
        let value = elem;
        for (const key of keys) {
            value = value[key];
            if (value === null || value === undefined) {
                return '';
            }
        }
        return value;
    }

    get formControls() {
        if (this.formName) {
            return this.formName.controls;
        } else {
            return null;
        }
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}
