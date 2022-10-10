import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBaseComponent } from '@sharedModule/components';
import { ValidationConstant, CommonRegexp } from '@sharedModule/constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { ContactusService } from 'edusense-users/src/app/public-modules/services';

@Component({
    selector: 'app-contact-us-page',
    templateUrl: './contact-us-page.component.html',
    styleUrls: ['./contact-us-page.component.scss']
})
export class ContactUsPageComponent extends FormBaseComponent
    implements OnInit {

    @ViewChild('contactFormRef') redirection: ElementRef;
    // Form Group Variable
    contactUsForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    constructor(
        fb: FormBuilder,
        private contactusService: ContactusService,
        private reCaptchaV3Service: ReCaptchaV3Service
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createContactUsForm();
    };

    createContactUsForm = () => {
        this.contactUsForm = this.createForm({
            first_name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            last_name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            email: [
                '',
                [
                    Validators.minLength(1),
                    Validators.maxLength(255),
                    Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)
                ]
            ],
            phone: [
                '',
                [
                    Validators.required,
                    Validators.minLength(7),
                    Validators.maxLength(14),
                    Validators.pattern(CommonRegexp.PHONE_REGEXP)
                ]
            ],
            city: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            institute: [
                '',
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(200),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            about_us: [
                '',
                [
                    Validators.minLength(1),
                    Validators.maxLength(1000),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            comments: [
                '',
                [
                    Validators.minLength(1),
                    Validators.maxLength(1000),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ]

            // recaptcha: ['', Validators.required]
        });
    };

    onSubmitContactUsForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const params = form.value;
            this.contactusService
                .submitContactReq(params)
                .subscribe((response) => {
                    this.createContactUsForm();
                });
        }
    };

    get formControls() {
        return this.contactUsForm.controls;
    }

    onContactFormRedirection() {
        this.redirection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

}
