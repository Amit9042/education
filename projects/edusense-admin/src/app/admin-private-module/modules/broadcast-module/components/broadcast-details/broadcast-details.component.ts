import { Component, OnInit } from '@angular/core';
import { FormBaseComponent } from 'utility-lib';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationConstant } from '../../../../../_shared/constants/admin-app-validation.constant';
import { BroadcastService } from '../../service';

@Component({
    selector: 'es-admin-broadcast-details',
    templateUrl: './broadcast-details.component.html',
    styleUrls: ['./broadcast-details.component.scss']
})
export class BroadcastDetailsComponent
    extends FormBaseComponent
    implements OnInit {
    // Form Group variables
    broadcastDetailsForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    constructor(_fb: FormBuilder, private broadcastService: BroadcastService) {
        super(_fb);
    }

    ngOnInit() {
        this.intialize();
    }

    intialize = () => {
        this.createBroadcastDetailsForm();
    };

    createBroadcastDetailsForm = () => {
        this.broadcastDetailsForm = this.createForm({
            broadcast_message: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(150)
                ]
            ]
        });
    };

    //Api Calls
    broadCastMessageApiCall = (param) => {
        return this.broadcastService.broadCastMessage(param);
    };

    onSubmitBroadcastDetailsForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const params = { message: form.value.broadcast_message };
            this.broadCastMessageApiCall(params).subscribe((response) => {
                this.createBroadcastDetailsForm();
            });
        }
    };

    get formControls() {
        return this.broadcastDetailsForm.controls;
    }
}
