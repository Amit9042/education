import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({selector: '[appAutofocus]'})

export class FocusDirective implements OnInit {

    constructor(private hostElement: ElementRef) {
    }

    ngOnInit() {
        this.hostElement.nativeElement.focus();
    }
}
