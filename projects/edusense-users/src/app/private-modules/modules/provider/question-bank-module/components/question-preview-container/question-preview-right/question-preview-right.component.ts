import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBaseComponent, ValidationConstant } from 'utility-lib';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EventEmitter } from 'protractor';
import { RouteConstant } from '@sharedModule/constants';
import { Router } from '@angular/router';

@Component({
    selector: 'es-user-question-preview-right',
    templateUrl: './question-preview-right.component.html',
    styleUrls: ['./question-preview-right.component.scss']
})
export class QuestionPreviewRightComponent extends FormBaseComponent
    implements OnInit {
    // Angular variables

    // Constant variables
    validationMsg = new ValidationConstant();


    constructor(fb: FormBuilder, private router: Router,) {
        super(fb);
    }

    ngOnInit(): void {}

    onSubmitEmitFn = () => {
    };

    onBack() {
        this.router.navigate(['/' + RouteConstant.QUE_BANK_QUE_LIST]);
    }

}
