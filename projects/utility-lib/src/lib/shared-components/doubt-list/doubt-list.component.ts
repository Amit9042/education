import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserTypeEnum } from '../../constants'
@Component({
    selector: 'es-user-doubt-list',
    templateUrl: './doubt-list.component.html',
    styleUrls: ['./doubt-list.component.scss']
})
export class DoubtListComponent implements OnInit {
    
    @Input() doubtList;
    @Input() userType;
    @Output() quesClick = new EventEmitter<any>();
    @Output() scroll = new EventEmitter<boolean>();
    @Output() bookmarkClick = new EventEmitter<any>();

    userTypeEnum = UserTypeEnum

    constructor(private router: Router) {}

    ngOnInit(): void {}

    onQuestionAnswer = (question) => {
        this.quesClick.emit(question);
    };

    onBookMarkQuestion = (question) => {
        this.bookmarkClick.emit(question);
    }

    onScroll() {
        this.scroll.emit(true);
    }

    onError(event) {
        event.target.src = 'assets/images/svg_files/defaultSubject.svg';
    }
}
