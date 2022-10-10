import {
    Component,
    OnInit,
    Input,
    ViewChild,
    Output,
    EventEmitter,
    SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginatorIntl, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { statusType, getClassForStatusType } from '@sharedModule/functions';
import { merge } from 'rxjs';
import * as moment from 'moment';
import { debounceTime, startWith } from 'rxjs/operators';

import { StatusType, PAGE_SIZE_OPTIONS } from '@sharedModule/constants';
import { DateFormatConst, ColumnTypeEnum } from './table-config.constants';
import { CustomPaginator } from './customPaginator';

@Component({
    selector: 'app-material-table',
    templateUrl: './material-table.component.html',
    styleUrls: ['./material-table.component.scss'],
    providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }]
})
export class MaterialTableComponent implements OnInit {
    // Angular variables
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    @Input() tableConfig: any = {};
    @Input() records = [];
    @Input() recordsPerPage;
    @Input() totalRecords = 0;
    @Input() totalPages = 1;
    @Input() isLoadingResults;
    @Input() setDefaultPage;

    @Output() criteriaChange = new EventEmitter<object>();
    @Output() pageChange = new EventEmitter<any>();
    @Output() statusChange = new EventEmitter<any>();
    @Output() actionChange = new EventEmitter<any>();
    @Output() columnClick = new EventEmitter<any>();

    // Constant variables
    getClassForStatusType = getClassForStatusType;
    statusType = StatusType;
    pageSizeOption = PAGE_SIZE_OPTIONS;
    columnType = ColumnTypeEnum;

    // Form control variables
    searchControls: Map<string, FormControl> = new Map<string, FormControl>();
    searchControlsValueChanges: any[] = [];
    displayColumns: string[] = [];

    constructor() {}

    ngOnInit() {
        for (const column of this.tableConfig.columns) {
            if (column.filter) {
                const control = new FormControl(column.filter.defaultValue);
                this.searchControls[column.filter.controlName] = control;
                this.searchControlsValueChanges.push(control.valueChanges);
            }
            this.displayColumns.push(column.columnName);
        }
        this.sortingAndPaginationChangeEvents();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.setDefaultPage) {
            this.paginator.pageIndex = 0;
        }
    }

    // Initialisation methods
    sortingAndPaginationChangeEvents = () => {
        merge(this.sort.sortChange, ...this.searchControlsValueChanges)
            .pipe(startWith({}), debounceTime(500))
            .subscribe(() => {
                // Nodejs Filter formate
                /* const filterCriteria = {};
                for (const column of this.tableConfig.columns) {
                    if (column.filter) {
                        filterCriteria[column.filter.controlName] = this.searchControls[column.filter.controlName].value;
                    }
                } */

                // For multiple select
                /*if (column.filter.type === "dropdownMulti") {
                    const dropdownValue = this.searchControls[
                      column.filter.controlName
                    ].value;
                    filterCriteria[column.filter.controlName] = dropdownValue
                      ? dropdownValue.filter(value => value !== "mat-option-all")
                      : dropdownValue;
                  } else {
                    filterCriteria[column.filter.controlName] = this.searchControls[
                      column.filter.controlName
                    ].value;
                  } */

                const filterCriteria = [];
                for (const column of this.tableConfig.columns) {
                    if (column.filter) {
                        const filter = {
                            column: column.filter.controlName,
                            values: [
                                this.searchControls[column.filter.controlName]
                                    .value
                            ],
                            operator: column.filter.operator
                        };
                        filterCriteria.push(filter);
                    }
                }
                const filters = {
                    sort: this.sort,
                    criteria: filterCriteria
                };
                this.paginator.pageIndex = 0;
                this.criteriaChange.emit(filters);
            });
    };

    // Action methods

    onClearFilter = () => {
        for (const column of this.tableConfig.columns) {
            if (column.filter) {
                this.searchControls[column.filter.controlName].setValue(
                    column.filter.defaultValue
                );
            }
        }
    };

    onShowClearSearch = () => {
        for (const column of this.tableConfig.columns) {
            if (column.filter) {
                if (
                    this.searchControls[column.filter.controlName].value !== ''
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    onAddRecord() {
        const actionDetails = {
            action: 'add'
        };
        this.actionChange.emit(actionDetails);
    }

    onSelect(allSelected, column) {
        const dropDownControl = this.searchControls[column.filter.controlName];
        const options = column.filter.options;
        if (
            dropDownControl.value.filter(value => value !== 'mat-option-all')
                .length === options.length
        ) {
            allSelected.select();
        } else {
            allSelected.deselect();
        }
    }

    onSelectAll(allSelected, column) {
        const dropDownControl = this.searchControls[column.filter.controlName];
        const options = column.filter.options;
        if (allSelected.selected) {
            dropDownControl.setValue(
                options.map(value =>
                    this.getColumnValue(value, column.metadata.key)
                )
            );
            allSelected.select();
        } else {
            dropDownControl.setValue([]);
        }
    }

    onColumnClick = (clm, element) => {
        const columnDetails = {
            column: clm,
            record: element
        };
        this.columnClick.emit(columnDetails);
    };

    onActionChange = (action, element) => {
        const actionDetails = {
            action: action,
            record: element
        };
        this.actionChange.emit(actionDetails);
    };

    onChangePagination(params) {
        const obj = {
            page: +params.pageIndex,
            pageSize: +params.pageSize
        };
        this.pageChange.emit(obj);
    }

    // Helper methods
    emptyList = () => {
        return !this.isLoadingResults && this.records.length === 0;
    };

    getColumnValue(elem: any, keyName: string) {
        if (Array.isArray(keyName)) {
            const value = [];
            keyName.forEach((item, index) => {
                if (this.getValueForKeyPath(elem, item)) {
                    value.push(this.getValueForKeyPath(elem, item));
                }
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

    getStatusType(status) {
        return statusType(status);
    }

    dateFormat(date, format) {
        const frmt = format || DateFormatConst.DEFAULT_FORMAT;
        return moment(date).format(frmt);
    }
}
