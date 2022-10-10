import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { UserTypeEnum, AppMessageConstants } from '../../constants';

@Component({
    selector: 'es-user-side-doubt-list',
    templateUrl: './side-doubt-list.component.html',
    styleUrls: ['./side-doubt-list.component.scss']
})
export class SideDoubtListComponent implements OnInit, OnChanges {

    @Output() linkClick = new EventEmitter<boolean>();
    @Output() quesClick = new EventEmitter<any>();
    @Input() lable;
    @Input() title;
    @Input() allDoubtList;

    isNotAdmitted = false;
    notAdmittedMsg: any;

    constructor(private router: Router,
        private _sharedService: SharedService) {}

    ngOnInit(): void {
        this.notAdmittedMsg = AppMessageConstants.NOT_ADMITTED;
        const userConfig = this._sharedService.getUserConfig();
        if (userConfig.app_id === UserTypeEnum.STUDENT) {
            this.isNotAdmitted = userConfig['enterprise'] && userConfig['enterprise'].length ? false : true;
        }
    }

    ngOnChanges() {
        if (this.allDoubtList.length && this.allDoubtList.length > 10) {
            this.allDoubtList = this.allDoubtList.slice(0, 10);
        }
    }

    onAllDoubts() {
        this.linkClick.emit(true);
    }

    onQuestionAnswer = (question) => {
        this.quesClick.emit(question);
    };

    onError(event) {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    }
}
