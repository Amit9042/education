import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    ALLOWED_LECTURE_FILE_TYPES,
    ALLOWED_MATERIAL_IMAGE_FILE_TYPES,
    ALLOWED_RESOURCES_FILE_TYPES,
    CommonRegexp,
    CONTENT_TYPE,
    ContentTypeViewEnum,
    FileSizeEnum,
    RouteConstant,
    ValidationConstant
} from '@sharedModule/constants';
import { CourseService } from '../../../services';
import { CourseLecturesModel, CoursePreviewModel } from '../../../models';
import {
    FormBaseComponent,
    PdfMaterialDialogComponent,
    ViewMaterialDialogComponent
} from '@sharedModule/components';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationMessageDialogComponent } from 'utility-lib';
import { getVideoDuration, removeEmptyFields } from '@sharedModule/functions';
import { SharedService } from '@sharedModule/services';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'es-user-content-course',
    templateUrl: './content-course.component.html',
    styleUrls: ['./content-course.component.scss']
})
export class ContentCourseComponent extends FormBaseComponent
    implements OnInit {
    // Angular variables
    @Output() onChangeStep = new EventEmitter();
    @Input() courseId: number;

    // Constant variables
    contentTypeViewEnum = ContentTypeViewEnum;
    contentType = CONTENT_TYPE;
    lectureFileType = ALLOWED_LECTURE_FILE_TYPES;
    resourceFileType = ALLOWED_RESOURCES_FILE_TYPES;
    imageFileType = ALLOWED_MATERIAL_IMAGE_FILE_TYPES;
    validationMsg = new ValidationConstant();

    // Form variables
    sectionForm: FormGroup;
    lectureTitleCtrl: FormControl = new FormControl('');
    urlCtrl: FormControl = new FormControl(
        '',
        Validators.pattern(CommonRegexp.YOUTUBE_REGEXP)
    );
    addSectionFormControl: FormControl = new FormControl('');
    descriptionFormControl: FormControl = new FormControl('');
    amountFormControl: FormControl = new FormControl(
        '',
        Validators.pattern(CommonRegexp.NUMBER_REGEXP)
    );
    editDescriptionFormControl: FormControl = new FormControl('');
    editAmountFormControl: FormControl = new FormControl(
        '',
        Validators.pattern(CommonRegexp.NUMBER_REGEXP)
    );

    // Data variables
    isExpandPanel: number[] = [];
    isExpandChildPanel: string[] = [];
    isExpandContentType: string = '';
    editDescription: string = '';
    coursePreviewDetails: CoursePreviewModel[] = [];
    sectionItemList: any[] = [];
    addLectureSectionList: number[] = [];
    videoDataArray = [];
    videoCoverImage = [];

    // State variables
    isShowLectureSaveBtn = false;
    isShowAddLectureView = false;
    isShowSectionTitle = false;
    isShowView = ContentTypeViewEnum.VIDEO_TYPE_CONTENT;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private formBuilder: FormBuilder,
        private courseService: CourseService,
        private sharedService: SharedService,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(fb);
    }

    ngOnInit(): void {
        this.createSectionForm();
        this.getSectionList();
    }

    // Initialisation methods
    getSectionList = () => {
        this.getCoursePreviewApiCall().subscribe(response => {
            this.coursePreviewDetails = response['payload']['sections'];
            let sections = this.sectionForm.get('sections') as FormArray;
            this.clearSectionFormArray(sections);
            this.coursePreviewDetails.forEach((record, sectionIndex) => {
                this.addSection(record);
                if (record.lectures.length > 0) {
                    record.lectures.forEach(lectureDetail => {
                        this.addLecture(lectureDetail, sectionIndex);
                    });
                }
            });
        });
    };

    createSectionForm = () => {
        this.sectionForm = this.createForm({
            sections: this.formBuilder.array([])
        });
    };

    createSection(sectionDetail: CoursePreviewModel = null): FormGroup {
        return this.fb.group({
            sectionId: sectionDetail ? sectionDetail?.section_id : null,
            sectionTitleCtrl: [sectionDetail ? sectionDetail.title : ''],
            lecture: this.formBuilder.array([])
        });
    }

    createLecture(lectureDetail: CourseLecturesModel = null): FormGroup {
        return this.fb.group({
            lectureId: lectureDetail ? lectureDetail?.lecture_id : null,
            sectionId: lectureDetail ? lectureDetail?.section_id : null,
            lectureTitle: [lectureDetail ? lectureDetail.title : ''],
            contentId: [
                lectureDetail && lectureDetail.lecture_content
                    ? lectureDetail.lecture_content.id
                    : ''
            ],
            description:
                lectureDetail && lectureDetail.lecture_content
                    ? lectureDetail.lecture_content.description
                    : '',
            contentType:
                lectureDetail && lectureDetail.lecture_content
                    ? lectureDetail.lecture_content.content_type
                    : '',
            duration:
                lectureDetail && lectureDetail.lecture_content
                    ? lectureDetail.lecture_content.content_duration
                    : '',
            path:
                lectureDetail && lectureDetail.lecture_content
                    ? lectureDetail.lecture_content.content_path
                    : '',
            type:
                lectureDetail &&
                lectureDetail.lecture_content &&
                lectureDetail.lecture_content.content_mime_type
                    ? lectureDetail.lecture_content.content_mime_type
                    : '',
            preview:
                lectureDetail && lectureDetail.lecture_content
                    ? lectureDetail.lecture_content.content_preview
                    : ''
        });
    }

    addSection(sectionDetail: CoursePreviewModel): void {
        this.sectionsFormArray().push(this.createSection(sectionDetail));
    }

    clearSectionFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    };

    addLecture(lectureDetail: CourseLecturesModel, sectionIndex: number): void {
        this.lectureFormArrayControls(sectionIndex).push(
            this.createLecture(lectureDetail)
        );
    }

    // Api calls
    getCoursePreviewApiCall = () => {
        return this.courseService.getCoursePreview(+this.courseId);
    };

    updateSectionApiCall = (sectionId: number, params: any) => {
        return this.courseService.updateSectionDetails(sectionId, params);
    };

    updateLectureApiCall = (lectureId: number, params: any) => {
        return this.courseService.updateLectureDetails(lectureId, params);
    };

    addLectureApiCall = (params: any) => {
        return this.courseService.addLectureDetails(params);
    };

    addSectionApiCall = (params: any) => {
        return this.courseService.addSection(params);
    };

    removeSectionApiCall = (sectionId: number) => {
        return this.courseService.removeSection(sectionId);
    };

    removeLectureApiCall = (lectureId: number) => {
        return this.courseService.removeLecture(lectureId);
    };

    addContentApiCall = (lectureId: number, params: any, fileObj = []) => {
        return this.courseService.addContent(lectureId, params, fileObj);
    };

    addResourceApiCall = (params: any, fileObj = []) => {
        return this.courseService.addResource(params, fileObj);
    };

    removeResourceApiCall = (resourceId: number) => {
        return this.courseService.removeResource(resourceId);
    };

    removeContentApiCall = (lectureId: number, contentId: number) => {
        return this.courseService.removeContent(lectureId, contentId);
    };

    generateSignedUrlApiCall = (lectureId: number, params: any) => {
        return this.courseService.generateSignedUrl(lectureId, params);
    };

    saveVideoApiCall = (url: string, params: any, fileObj) => {
        return this.courseService.saveVideoFile(url, params, fileObj);
    };

    storedVideoDataApiCall = (
        lectureId: number,
        params: any,
        fileObj: any[]
    ) => {
        return this.courseService.storedVideoData(lectureId, params, fileObj);
    };

    // Page events
    onAddSection = () => {
        this.addSectionApiCall({
            courseId: this.courseId,
            title: this.addSectionFormControl.value
        }).subscribe(() => {
            this.addSectionFormControl.setValue('');
            this.isShowSectionTitle = false;
            this.getSectionList();
        });
    };

    onRemoveNotAddedSection = () => {
        this.addSectionFormControl.setValue('');
        this.isShowSectionTitle = false;
    };

    removeContent = (lectureId: number, contentId: number) => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Delete Content',
                caption: 'Are you sure you want to delete this content?',
                primaryButtonLabel: 'Delete',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeContentApiCall(lectureId, contentId).subscribe(
                    () => {
                        this.getSectionList();
                    }
                );
            }
        });
    };

    onFocusLectureTitle = () => {
        this.isShowLectureSaveBtn = true;
    };

    onCreateLecture = (sectionIndex: number) => {
        let params = {
            sectionId: this.formControls(sectionIndex)['sectionId'],
            title: this.lectureTitleCtrl.value
        };
        this.addLectureApiCall(params).subscribe(() => {
            this.lectureTitleCtrl.setValue('');
            this.getSectionList();
            this.addLectureSectionList = [];
        });
    };

    onRemoveNewLecture = (sectionIndex: number) => {
        this.lectureTitleCtrl.setValue('');
        let index = this.addLectureSectionList.findIndex(
            record => record === sectionIndex
        );
        if (index > -1) {
            this.addLectureSectionList.splice(index, 1);
        }
    };

    onClickAddLecture = (sectionIndex: number) => {
        let index = this.addLectureSectionList.findIndex(
            record => record === sectionIndex
        );
        if (index === -1) {
            this.addLectureSectionList.push(sectionIndex);
        }
    };

    onSaveSection = (index: number) => {
        this.updateSection(this.formControls(index)['sectionId'], {
            title: this.formControls(index)['sectionTitleCtrl']
        });
    };

    updateSection = (sectionId: number, params: any) => {
        this.updateSectionApiCall(sectionId, params).subscribe(() => {
            this.getSectionList();
        });
    };

    onRemoveLecture = (sectionIndex: number, lectureIndex: number) => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Delete Lecture',
                caption: 'Are you sure you want to delete this lecture?',
                primaryButtonLabel: 'Delete',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const lectureId = this.lectureFormControls(
                    sectionIndex,
                    lectureIndex
                )['lectureId'];
                const index = this.isExpandChildPanel.indexOf(
                    `${sectionIndex}.${lectureIndex}`
                );
                this.removeLectureApiCall(lectureId).subscribe(() => {
                    if (index !== -1) {
                        this.isExpandChildPanel.splice(index, 1);
                    }
                    this.getSectionList();
                });
            }
        });
    };

    onSaveLectureDetails = (sectionIndex: number, lectureIndex: number) => {
        this.updateLecture(
            this.lectureFormControls(sectionIndex, lectureIndex)['lectureId'],
            {
                title: this.lectureFormControls(sectionIndex, lectureIndex)[
                    'lectureTitle'
                ]
            }
        );
    };

    updateLecture = (lectureId: number, params: any) => {
        this.updateLectureApiCall(lectureId, params).subscribe(() => {
            this.getSectionList();
        });
    };

    onClickDeleteSection = (sectionIndex: number) => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Delete Section',
                caption: 'Are you sure you want to delete this section?',
                primaryButtonLabel: 'Delete',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const sectionId = this.formControls(sectionIndex)['sectionId'];
                const index = this.isExpandPanel.indexOf(sectionIndex);
                this.removeSectionApiCall(sectionId).subscribe(() => {
                    if (index !== -1) {
                        this.isExpandPanel.splice(index, 1);
                    }
                    this.getSectionList();
                });
            }
        });
    };

    onAddDescription = (sectionIndex: number, lectureIndex: number) => {
        if (this.descriptionFormControl.value) {
            const lectureId = this.lectureFormControls(
                sectionIndex,
                lectureIndex
            )['lectureId'];
            let params = removeEmptyFields({
                contentType: 1,
                text: this.descriptionFormControl.value,
                duration: this.amountFormControl.value
            });
            this.addContent(lectureId, params);
        }
    };

    addContent = (lectureId: number, params: any, fileObj = []) => {
        this.addContentApiCall(lectureId, params, fileObj).subscribe(() => {
            this.isExpandContentType = '';
            this.descriptionFormControl.setValue('');
            this.amountFormControl.setValue('');
            this.editDescriptionFormControl.setValue('');
            this.editAmountFormControl.setValue('');
            this.urlCtrl.setValue('');
            this.editDescription = '';
            this.getSectionList();
        });
    };

    onAddLink = (sectionIndex: number, lectureIndex: number) => {
        if (this.urlCtrl.value) {
            const lectureId = this.lectureFormControls(
                sectionIndex,
                lectureIndex
            )['lectureId'];
            let params = removeEmptyFields({
                contentType: 2,
                link: this.urlCtrl.value
            });
            this.addContent(lectureId, params);
        }
    };

    onSectionTitleOpen = () => {
        this.isShowSectionTitle = true;
    };

    onToggleMainPanel(sectionIndex) {
        if (this.isExpandPanel.includes(sectionIndex)) {
            const index = this.isExpandPanel.indexOf(sectionIndex);
            this.isExpandPanel.splice(index, 1);
        } else {
            this.isExpandPanel.push(sectionIndex);
        }
    }

    onTogglePanel(sectionIndex, lectureIndex) {
        if (
            this.isExpandChildPanel.includes(`${sectionIndex}.${lectureIndex}`)
        ) {
            const index = this.isExpandChildPanel.indexOf(
                `${sectionIndex}.${lectureIndex}`
            );
            this.isExpandChildPanel.splice(index, 1);
        } else {
            this.isExpandChildPanel.push(`${sectionIndex}.${lectureIndex}`);
        }
    }

    onToggleContentType(sectionIndex: number, lectureIndex: number) {
        this.isShowView = this.contentTypeViewEnum.VIDEO_TYPE_CONTENT;
        if (this.isExpandContentType === `${sectionIndex}.${lectureIndex}`) {
            this.isExpandContentType = '';
        } else {
            this.isExpandContentType = `${sectionIndex}.${lectureIndex}`;
        }
    }

    onChangeContentType = event => {
        if (event.value === '1') {
            this.isShowView = this.contentTypeViewEnum.VIDEO_TYPE_CONTENT;
        } else if (event.value === '2') {
            this.isShowView = this.contentTypeViewEnum.DESCRIPTION_TYPE_CONTENT;
        } else if (event.value === '3') {
            this.isShowView = this.contentTypeViewEnum.LINK_TYPE_CONTENT;
        } else if (event.value === '4') {
            this.isShowView = this.contentTypeViewEnum.FILE_TYPE_CONTENT;
        }
    };

    onClickEditDescription = (
        sectionIndex: number,
        lectureIndex: number,
        description: string,
        duration: number
    ) => {
        this.editDescription = `${sectionIndex}.${lectureIndex}`;
        this.editDescriptionFormControl.setValue(description);
        this.editAmountFormControl.setValue(duration);
    };

    onCancelEditDescription = () => {
        this.editDescription = '';
        this.editDescriptionFormControl.setValue('');
        this.editAmountFormControl.setValue('');
    };

    onUpdateDescription = (sectionIndex: number, lectureIndex: number) => {
        if (this.editDescriptionFormControl.value) {
            const lectureId = this.lectureFormControls(
                sectionIndex,
                lectureIndex
            )['lectureId'];
            const contentId = this.lectureFormControls(
                sectionIndex,
                lectureIndex
            )['contentId'];
            this.removeContentApiCall(lectureId, contentId).subscribe(() => {
                let params = removeEmptyFields({
                    contentType: 1,
                    text: this.editDescriptionFormControl.value,
                    duration: this.editAmountFormControl.value
                });
                this.addContent(lectureId, params);
            });
        }
    };

    onPreviewStep() {
        this.onChangeStep.emit('overview');
    }

    onNextStep() {
        this.onChangeStep.emit('additional-info');
    }

    onLectureFileUpload = (
        event,
        sectionIndex: number,
        lectureIndex: number
    ) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validType = !this.lectureFileType.find(
                e1 => e1.name == file.type
            );
            if (validType) {
                this.sharedService.setSnackBar(`Only PDF file is allowed`);
            } else {
                if (
                    event.target.files[0].size > FileSizeEnum.TEN_MB_IMAGE_SIZE
                ) {
                    this.sharedService.setSnackBar(
                        this.validationMsg.VALID_TEN_MB_FILE_SIZE
                    );
                } else {
                    const reader = new FileReader();
                    reader.onloadend = (loadEvent: any) => {
                        let imagePath = loadEvent.target.result;
                        const image = new Image();
                        image.src = imagePath;
                        let array = [
                            {
                                reqKey: 'file',
                                files: event.target.files,
                                name: file.name
                            }
                        ];
                        const lectureId = this.lectureFormControls(
                            sectionIndex,
                            lectureIndex
                        )['lectureId'];
                        let params = removeEmptyFields({
                            contentType: 3
                        });
                        this.addContent(lectureId, params, array);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    onVideoUpload = (
        event: any,
        sectionIndex: number,
        lectureIndex: number
    ) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > FileSizeEnum.FOUR_GB_SIZE) {
                this.sharedService.setSnackBar(
                    this.validationMsg.VALID_FOUR_GB_FILE_SIZE
                );
            } else {
                const reader = new FileReader();
                reader.onloadend = (loadEvent: any) => {
                    const params = { fileName: file.name };
                    let array = [
                        {
                            reqKey: 'file',
                            files: [file],
                            name: file.name
                        }
                    ];
                    let aud = new Audio(reader.result as string);
                    let self = this;
                    aud.onloadedmetadata = function() {
                        array[0]['duration'] = aud.duration;
                        const index = self.videoDataArray.findIndex(
                            record =>
                                record['id'] ===
                                `${sectionIndex}-${lectureIndex}`
                        );
                        if (index === -1) {
                            self.videoDataArray.push({
                                params,
                                array,
                                id: `${sectionIndex}-${lectureIndex}`
                            });
                        } else {
                            self.videoDataArray[index] = {
                                params,
                                array,
                                id: `${sectionIndex}-${lectureIndex}`
                            };
                        }
                    };
                };
                reader.readAsDataURL(file);
            }
        }
    };

    onVideoCoverImageFileUpload = (
        event,
        sectionIndex: number,
        lectureIndex: number
    ) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validType = !this.imageFileType.find(e1 => e1 === file.type);
            if (validType) {
                this.sharedService.setSnackBar(
                    `Unsupported File ${file['name']}. Please select valid type`
                );
            } else {
                if (
                    event.target.files[0].size > FileSizeEnum.TEN_MB_IMAGE_SIZE
                ) {
                    this.sharedService.setSnackBar(
                        this.validationMsg.VALID_TEN_MB_FILE_SIZE
                    );
                } else {
                    const reader = new FileReader();
                    reader.onloadend = (loadEvent: any) => {
                        let imagePath = loadEvent.target.result;
                        const image = new Image();
                        image.src = imagePath;
                        const index = this.videoCoverImage.findIndex(
                            record =>
                                record['id'] ===
                                `${sectionIndex}-${lectureIndex}`
                        );
                        if (index === -1) {
                            this.videoCoverImage.push({
                                id: `${sectionIndex}-${lectureIndex}`,
                                reqKey: 'cover',
                                files: event.target.files,
                                name: file.name
                            });
                        } else {
                            this.videoCoverImage[index] = {
                                id: `${sectionIndex}-${lectureIndex}`,
                                reqKey: 'cover',
                                files: event.target.files,
                                name: file.name
                            };
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    uploadVideo = (sectionIndex: number, lectureIndex: number) => {
        const lectureId = this.lectureFormControls(sectionIndex, lectureIndex)[
            'lectureId'
        ];
        const videoDataObj = this.videoDataArray.find(
            record => record['id'] === `${sectionIndex}-${lectureIndex}`
        );
        this.generateSignedUrlApiCall(
            lectureId,
            videoDataObj['params']
        ).subscribe(response => {
            let params = response['payload']['formData']['fields'];
            const url = response['payload']['formData']['url'];
            this.saveVideoApiCall(url, params, videoDataObj['array']).subscribe(
                () => {
                    const coverImageObject = this.videoCoverImage.find(
                        record =>
                            record['id'] === `${sectionIndex}-${lectureIndex}`
                    );
                    const coverImageArray = coverImageObject
                        ? [coverImageObject]
                        : [];
                    this.storedVideoDataApiCall(
                        lectureId,
                        {
                            key: params['key'],
                            size: videoDataObj['array'][0]['files'][0].size,
                            extension: videoDataObj['array'][0]['files'][0].name
                                .split('.')
                                .pop(),
                            type: videoDataObj['array'][0]['files'][0].type,
                            duration: Math.floor(
                                videoDataObj['array'][0]['duration']
                            )
                        },
                        coverImageArray
                    ).subscribe(() => {
                        const index = this.videoCoverImage.findIndex(
                            record =>
                                record['id'] ===
                                `${sectionIndex}-${lectureIndex}`
                        );
                        if (index > -1) {
                            this.videoCoverImage.splice(index, 1);
                        }
                        this.videoCoverImage = [];
                        const videoDataIndex = this.videoDataArray.findIndex(
                            record =>
                                record['id'] ===
                                `${sectionIndex}-${lectureIndex}`
                        );
                        if (videoDataIndex > -1) {
                            this.videoDataArray.splice(videoDataIndex, 1);
                        }
                        this.getSectionList();
                    });
                }
            );
        });
    };

    removeCoverImage = (sectionIndex: number, lectureIndex: number) => {
        const index = this.videoCoverImage.findIndex(
            record => record['id'] === `${sectionIndex}-${lectureIndex}`
        );
        if (index > -1) {
            this.videoCoverImage.splice(index, 1);
        }
    };

    onResourceFileUpload = (
        event,
        sectionIndex: number,
        lectureIndex: number
    ) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validType = !this.resourceFileType.find(
                e1 => e1.name == file.type
            );
            if (validType) {
                this.sharedService.setSnackBar(
                    `Unsupported File ${file['name']}. Please select valid type`
                );
            } else {
                if (
                    event.target.files[0].size > FileSizeEnum.TEN_MB_IMAGE_SIZE
                ) {
                    this.sharedService.setSnackBar(
                        this.validationMsg.VALID_TEN_MB_FILE_SIZE
                    );
                } else {
                    const reader = new FileReader();
                    reader.onloadend = (loadEvent: any) => {
                        let imagePath = loadEvent.target.result;
                        const image = new Image();
                        image.src = imagePath;
                        let array = [
                            {
                                reqKey: 'file',
                                files: event.target.files,
                                name: file.name
                            }
                        ];
                        const lectureId = this.lectureFormControls(
                            sectionIndex,
                            lectureIndex
                        )['lectureId'];
                        let params = removeEmptyFields({
                            contentType: 3
                        });
                        this.addResource(
                            { lectureId: lectureId, title: file.name },
                            array
                        );
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    onBrowseFile(id) {
        document.getElementById(id).click();
    }

    addResource = (params: any, fileObj = []) => {
        this.addResourceApiCall(params, fileObj).subscribe(() => {
            this.getSectionList();
        });
    };

    removeResourceFile = (resourceId: number) => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Delete Resource File',
                caption: 'Are you sure you want to delete this resource file?',
                primaryButtonLabel: 'Delete',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeResourceApiCall(resourceId).subscribe(() => {
                    this.getSectionList();
                });
            }
        });
    };

    onClickYoutubeVideo = (path: string) => {
        const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
            panelClass: 'view-material-dialog-container',
            data: {
                fileData: path,
                isYoutube: true,
                isAudio: false,
                showOptions: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {});
    };

    onClickVideo = (path: string, type: string) => {
        const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
            panelClass: 'view-material-dialog-container',
            data: {
                fileData: path,
                isYoutube: false,
                isAudio: false,
                showOptions: false,
                fileType: type
            }
        });
        dialogRef.afterClosed().subscribe(result => {});
    };

    onClickFile = (path: string) => {
        const dialogRef = this.dialog.open(PdfMaterialDialogComponent, {
            panelClass: 'pdf-material-dialog-container',
            data: {
                fileData: path,
                fileType: 'application/pdf',
                showOptions: false,
                showDownload: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {});
    };

    onCourseList = () => {
        this.router.navigate(['/' + RouteConstant.COURSE_LIST]);
    };

    // Helper methods
    sectionsFormArray(): FormArray {
        return this.sectionForm.get('sections') as FormArray;
    }

    formControls(index: number): FormGroup {
        return this.sectionsFormArray().controls[index].value;
    }

    lectureFormArrayControls(sectionIndex): FormArray {
        return this.sectionsFormArray()
            .at(sectionIndex)
            .get('lecture') as FormArray;
    }

    lectureFormControls(sectionIndex: number, lectureIndex: number): FormGroup {
        return this.lectureFormArrayControls(sectionIndex).controls[
            lectureIndex
        ].value;
    }

    getTitleChangeStatus = (index: number) => {
        let section = this.formControls(index)['sectionTitleCtrl'];
        let savedValue =
            index < this.coursePreviewDetails.length
                ? this.coursePreviewDetails[index].title
                : '';
        return section !== savedValue;
    };

    getLectureTitleChangeStatus = (
        sectionIndex: number,
        lectureIndex: number
    ) => {
        let lectureTitle = this.lectureFormControls(sectionIndex, lectureIndex)[
            'lectureTitle'
        ];
        let savedLectureTitle =
            sectionIndex < this.coursePreviewDetails.length
                ? lectureIndex <
                  this.coursePreviewDetails[sectionIndex].lectures.length
                    ? this.coursePreviewDetails[sectionIndex].lectures[
                          lectureIndex
                      ].title
                    : ''
                : '';
        return lectureTitle !== savedLectureTitle;
    };

    getExpandContentTypeStatus = (
        sectionIndex: number,
        lectureIndex: number
    ) => {
        return this.isExpandContentType === `${sectionIndex}.${lectureIndex}`;
    };

    getResourceFile = (sectionId: number, lectureId: number) => {
        const sectionObj = this.coursePreviewDetails.find(
            record => record.section_id === sectionId
        );
        const lectureObj = sectionObj.lectures.find(
            lecRecord => lecRecord.lecture_id === lectureId
        );
        return lectureObj.resources.length > 0 ? lectureObj.resources : [];
    };

    getIcon = (extension: string) => {
        let icon = this.resourceFileType
            .filter(e => e.name == extension)
            .map(e => e.icon)[0];
        return icon ? icon : 'defaultMaterial';
    };

    getDuration = (total: number) => {
        return getVideoDuration(total);
    };

    generateThumbnail(videoFile: any): Promise<any> {
        const video: HTMLVideoElement = this.document.createElement('video');
        const canvas: HTMLCanvasElement = this.document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        return new Promise<any>((resolve, reject) => {
            canvas.addEventListener('error', reject);
            video.addEventListener('error', reject);
            video.addEventListener('canplay', event => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(
                    video,
                    0,
                    0,
                    video.videoWidth,
                    video.videoHeight
                );
                resolve([
                    videoFile,
                    this.base64StringToFile(
                        canvas.toDataURL('image/jpg').split(',')[1],
                        videoFile[0].name,
                        'image/jpg'
                    )
                ]);
            });
            if (videoFile.type) {
                video.setAttribute('type', videoFile.type);
            }
            video.preload = 'auto';
            video.src = window.URL.createObjectURL(videoFile[0]);
            video.load();
        });
    }

    base64StringToFile = (base64String, fileName, type) => {
        const byteArray = Uint8Array.from(
            atob(base64String)
                .split('')
                .map(char => char.charCodeAt(0))
        );
        return new File([byteArray], fileName, { type });
    };

    showDoneButton = (sectionIndex: number, lectureIndex: number) => {
        const index = this.videoDataArray.findIndex(
            record => record['id'] === `${sectionIndex}-${lectureIndex}`
        );
        return index > -1;
    };

    showImageName = (sectionIndex: number, lectureIndex: number) => {
        const index = this.videoCoverImage.findIndex(
            record => record['id'] === `${sectionIndex}-${lectureIndex}`
        );
        return index > -1;
    };

    getCoverImageName = (sectionIndex: number, lectureIndex: number) => {
        const object = this.videoCoverImage.find(
            record => record['id'] === `${sectionIndex}-${lectureIndex}`
        );
        return object['name'];
    };
}
