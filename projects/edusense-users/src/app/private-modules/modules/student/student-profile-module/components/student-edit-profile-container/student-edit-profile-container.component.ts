import { Component, OnInit } from '@angular/core';
import { ProfileDetailModel } from '../../models';
import { SharedUserService, SharedService } from '@sharedModule/services';
import { isValidImageType } from '@sharedModule/functions';
import { FileSizeEnum, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-student-edit-profile-container',
    templateUrl: './student-edit-profile-container.component.html',
    styleUrls: ['./student-edit-profile-container.component.scss']
})
export class StudentEditProfileContainerComponent implements OnInit {

    userDetail: ProfileDetailModel;
    uploadeImage = [];
    imageUploadDetails;

    constructor(private _sharedUserService: SharedUserService,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService) {}

    ngOnInit() {
        this.userDetail = this._sharedUserService.getUser();
        if (this.userDetail.user_details) {
          this.imageUploadDetails = this.userDetail.user_details.avatar_thumbnail;
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.EDIT_PROFILE_VIEW_STUD, {});
    }

    // file upload
    onFileUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isValidImageType(event.target.files[0].type)) {
                if (
                    event.target.files[0].size > FileSizeEnum.FIVE_MB_IMAGE_SIZE
                ) {
                    this._sharedService.setSnackBar(
                        'File size is greater then 5 MB.'
                    );
                    event.target.value = null;
                } else {
                    this.uploadeImage = [];
                    const reader = new FileReader();
                    reader.onloadend = (loadEvent: any) => {
                        this.imageUploadDetails = loadEvent.target.result;
                        this.uploadeImage.push({
                            reqKey: 'logo',
                            files: event.target.files
                        });
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                this._sharedService.setSnackBar('Please select the valid file.');
                event.target.value = null;
            }
        }
    };

    onError = event => {
        event.target.src = 'assets/images/svg_files/studentProfile.svg';
    };

    onBrowseFile(id) {
        document.getElementById(id).click();
    }
}
