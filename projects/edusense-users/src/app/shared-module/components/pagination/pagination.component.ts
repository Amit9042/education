import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppMessageConstants, PAGE_SIZE_OPTIONS} from '@sharedModule/constants';
import {SharedService} from '@sharedModule/services';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

    // Angular variables
    @Input() totalElements: number;
    @Input() rowNumber: number;
    @Input() recordsPerPage: number;
    @Output() recordChange: EventEmitter<any> = new EventEmitter();

    // Pagination variables
    readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

    constructor(private sharedService: SharedService) {
    }

    ngOnInit() {
    }

    // Page events
    onClickGoToRecords = (value) => {
        const val = +(value);
        if (!(val) || (val > this.totalElements) || (val < 1)) {
            this.sharedService.setSnackBar(AppMessageConstants.VALID_NUMBER);
        } else {
            const params = {
                rowNumber: value,
                recordsPerPage: this.recordsPerPage
            };
            this.recordChange.emit(params);
        }
    };

    onClickNext = () => {
        const params = {
            rowNumber: (this.rowNumber + this.recordsPerPage),
            recordsPerPage: this.recordsPerPage
        };
        this.recordChange.emit(params);
    };

    onClickPrevious = () => {
        const params = {
            rowNumber: ((this.rowNumber > this.recordsPerPage) ? (this.rowNumber - this.recordsPerPage) : 1),
            recordsPerPage: this.recordsPerPage
        };
        this.recordChange.emit(params);
    };

    onChangePageSize = (value) => {
        const params = {
            rowNumber: this.rowNumber,
            recordsPerPage: +(value)
        };
        this.recordChange.emit(params);
    };
}
