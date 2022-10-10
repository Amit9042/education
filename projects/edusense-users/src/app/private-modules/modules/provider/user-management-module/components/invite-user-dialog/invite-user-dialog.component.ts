import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBaseComponent } from '@sharedModule/components';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
    CommonRegexp,
    ValidationConstant,
    OperatorEnum
} from '@sharedModule/constants';
import { UsersService } from '../../service';
import { Role } from '../../models';

@Component({
    selector: 'app-invite-user-dialog',
    templateUrl: './invite-user-dialog.component.html',
    styleUrls: ['./invite-user-dialog.component.scss']
})
export class InviteUserDialogComponent extends FormBaseComponent
    implements OnInit {
    // Form Group variables
    inviteUserForm: FormGroup;
    rowFields: FormArray;

    // Constants variables
    validationMsg = new ValidationConstant();
    providerId;
    roleList: Role[] = [];

    constructor(
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<InviteUserDialogComponent>,
        private _usersService: UsersService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(_fb);
    }

    ngOnInit() {
        this.providerId = this.data['providerId'];
        this.roleList = this.data['roleList'];
        this.intialize();
    }

    intialize = () => {
        this.createInviteUserForm();
    };

    createInviteUserForm = () => {
        this.inviteUserForm = this._fb.group({
            rowFields: this._fb.array([this.createInviteUserRowField()])
        });
    };

    createInviteUserRowField(): FormGroup {
        return this.fb.group({
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
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(255),
                    Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)
                ]
            ],
            role: ['', [Validators.required]]
        });
    }

    onSubmitInviteUserForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            this.inviteUser(form.value['rowFields']);
        }
    };

    addRowFields(): void {
        this.rowFields = this.inviteUserForm.get('rowFields') as FormArray;
        if (this.rowFields.length < 10) {
            this.rowFields.push(this.createInviteUserRowField());
        }
    }

    removeRowFields(index) {
        this.rowFields = this.inviteUserForm.get('rowFields') as FormArray;
        if (this.rowFields.length > 1) {
            this.rowFields.removeAt(index);
        }
        // (this.rowFields.get('rowFields') as FormArray).removeAt(index);
    }

    onDialogClose(flag: boolean) {
        this.dialogRef.close(flag);
    }

    get formControls() {
        return this.inviteUserForm.controls;
    }

    formArrayControls(): FormArray {
        return this.inviteUserForm.get('rowFields') as FormArray;
    }

    inviteUser = param => {
        param = { provider_id: this.providerId, users: param };
        console.log(param);
        this._usersService.inviteUser(param).subscribe(response => {
            this.onDialogClose(true);
        });
    };
}
