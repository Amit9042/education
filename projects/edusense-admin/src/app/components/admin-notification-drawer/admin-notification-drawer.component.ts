import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-admin-notification-drawer',
    templateUrl: './admin-notification-drawer.component.html',
    styleUrls: ['./admin-notification-drawer.component.scss']
})
export class AdminNotificationDrawerComponent implements OnInit {
    // Angular variables
    @Output() clickEvent = new EventEmitter<boolean>();
    @Input() data;
    @Output() closeDrawerEvent = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit() {}

    markAsAllRead() {}

    onCloseDrawer() {
        this.clickEvent.emit();
        this.closeDrawerEvent.emit(false);
    }

    onScroll() {}
}
