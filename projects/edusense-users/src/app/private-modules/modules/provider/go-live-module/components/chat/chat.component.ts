import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    // Angular variables
    @Output() clickEvent = new EventEmitter<boolean>();
    @Output() sendMsg = new EventEmitter<string>();

    constructor() {}

    ngOnInit() {}

    onCloseChat() {
        this.clickEvent.emit(true);
    }
}
