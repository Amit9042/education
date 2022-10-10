import { Component, OnInit } from '@angular/core';
import { SharedUserService, SharedService } from '@sharedModule/services';
import { ActivatedRoute } from '@angular/router';
import {
    SubjectListModel,
    ProviderTypeListModel,
    GradeListModel,
    BoardListModel,
    MediumListModel,
    CityModel,
    CountryModdel
} from '../../models';
import { isValidImageType } from '@sharedModule/functions';
import { FileSizeEnum, RoleMaster, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-edit-profile-container',
    templateUrl: './edit-profile-container.component.html',
    styleUrls: ['./edit-profile-container.component.scss']
})
export class EditProfileContainerComponent implements OnInit {
    //Data variable
    subjectList: SubjectListModel[] = [];
    providerTypeList: ProviderTypeListModel[] = [];
    gradeList: GradeListModel[] = [];
    boardList: BoardListModel[] = [];
    mediumList: MediumListModel[] = [];
    countryList: CountryModdel[] = [];
    uploadeImage = [];

    userData = null;
    imageUploadDetails;
    isProviderDetails = false;
    isLocationDetails = false;
    isOwner = false;

    constructor(
        private _sharedUserService: SharedUserService,
        private _activeRoute: ActivatedRoute,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService
    ) {}

    ngOnInit() {
        const config = this._sharedService.getUserConfig();
        if (config['user_role_link.role_id'] === RoleMaster.PROVIDER_OWNER) {
            this.isProviderDetails = true;
            this.isLocationDetails = true;
            this.isOwner = true;
        }
        this.userData = this._sharedUserService.getUser();
        this.imageUploadDetails = this.userData.user.avatar;
        this.initialize();
        this._mixpanelService.track(MIXPANEL_EVENTS.EDIT_PROFILE_VIEW, {});
    }

    initialize = () => {
        // this.routeSubscriber();
    };

    /**
     * Router Subscriber
     */
    routeSubscriber = () => {
        this._activeRoute.params.subscribe(params => {
            this._activeRoute.data.subscribe(({ resolvedData }) => {
                this.handleResolverData(resolvedData);
            });
        });
    };

    handleResolverData = resolvedData => {
        if (resolvedData.providerTypeList) {
            this.providerTypeList = resolvedData.providerTypeList;
        }
        if (resolvedData.gradeList) {
            this.gradeList = resolvedData.gradeList;
        }
        if (resolvedData.boardList) {
            this.boardList = resolvedData.boardList;
        }
        if (resolvedData.mediumList) {
            this.mediumList = resolvedData.mediumList;
        }
        if (resolvedData.subjectList) {
            this.subjectList = resolvedData.subjectList;
        }
        if (resolvedData.countryList) {
            this.countryList = resolvedData.countryList;
        }
    };

    //file upload
    onFileUpload = event => {
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
                this._sharedService.setSnackBar(
                    'Please select the valid file.'
                );
                event.target.value = null;
            }
        }
    };

    onError = event => {
        event.target.src = 'assets/images/svg_files/providerProfile.svg';
    };

    onBrowseFile(id) {
        document.getElementById(id).click();
    }
}
