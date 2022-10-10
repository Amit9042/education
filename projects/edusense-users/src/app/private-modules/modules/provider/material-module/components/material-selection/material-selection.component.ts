import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    RouteConstant,
    PAGE_SIZE_OPTIONS,
    ALLOWED_MATERIAL_FILE_TYPES,
    ALLOWED_MATERIAL_VIDEO_FILE_TYPES,
    ALLOWED_MATERIAL_IMAGE_FILE_TYPES,
    ALLOWED_MATERIAL_PDF_FILE_TYPES,
    ALLOWED_MATERIAL_AUDIO_FILE_TYPES,
    ALLOWED_MATERIAL_EXCEL_FILE_TYPES,
    ALLOWED_MATERIAL_DOC_FILE_TYPES,
    ALLOWED_MATERIAL_PPT_FILE_TYPES,
    ViewType,
    ALLOWED_MATERIAL_TXT_FILE_TYPES,
    ALLOWED_MATERIAL_ZIP_FILE_TYPES,
    MIXPANEL_EVENTS,
    MATERIAL_TYPE,
    ALLOWED_MATERIAL_YOUTUBE_FILE_TYPES
} from '@sharedModule/constants';
import { AddMaterialDialogComponent } from '../add-material-dialog/add-material-dialog.component';
import {
    ConfirmationMessageDialogComponent,
    ViewMaterialDialogComponent,
    PptExcelViewMaterialDialogComponent,
    PdfMaterialDialogComponent,
    ImageMaterialViewComponent,
    DocMaterialViewDialogComponent
} from '@sharedModule/components';
import { MaterialService } from '../../service';
import { merge } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import {
    getQueryParams,
    saveFile,
    bytesToSizeInMB
} from '@sharedModule/functions';
import { Material } from '../../models';
import { ForageService, SharedUserService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-material-selection',
    templateUrl: './material-selection.component.html',
    styleUrls: ['./material-selection.component.scss']
})
export class MaterialSelectionComponent implements OnInit, OnDestroy {
    // Form Variables
    nameFilterField: FormControl = new FormControl('');
    types = new FormControl();

    //sub
    materialUploadCom$;

    // State Variables
    isLoadingResults = true;

    fileType = ALLOWED_MATERIAL_FILE_TYPES;
    videoType = ALLOWED_MATERIAL_VIDEO_FILE_TYPES;
    imageType = ALLOWED_MATERIAL_IMAGE_FILE_TYPES;
    pdfType = ALLOWED_MATERIAL_PDF_FILE_TYPES;
    audioType = ALLOWED_MATERIAL_AUDIO_FILE_TYPES;
    excelType = ALLOWED_MATERIAL_EXCEL_FILE_TYPES;
    docType = ALLOWED_MATERIAL_DOC_FILE_TYPES;
    pptType = ALLOWED_MATERIAL_PPT_FILE_TYPES;
    textType = ALLOWED_MATERIAL_TXT_FILE_TYPES;
    zipType = ALLOWED_MATERIAL_ZIP_FILE_TYPES;
    youtubeType = ALLOWED_MATERIAL_YOUTUBE_FILE_TYPES;
    filterType = [];
    materialType = MATERIAL_TYPE;

    // data variable
    materialList: Material[] = [];
    previewImgURL: any;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;
    selectedGradeAndSubject;
    filterTypeShow;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private _materialService: MaterialService,
        private forageService: ForageService,
        private _mixpanelService: MixpanelService,
        private _sharedUserService: SharedUserService
    ) {}

    ngOnInit() {
        this.selectedGradeAndSubject = this._materialService.getMaterialFilterData();
        this.filterType = [
            { name: 'Image', value: this.imageType },
            { name: 'Audio', value: this.audioType },
            { name: 'Video', value: this.videoType },
            { name: 'Excel', value: this.excelType },
            { name: 'Power Point', value: this.pptType },
            { name: 'Document', value: this.docType },
            { name: 'Text', value: this.textType },
            { name: 'PDF', value: this.pdfType },
            { name: 'Zip', value: this.zipType }
        ];
        merge(this.nameFilterField.valueChanges, this.types.valueChanges)
            .pipe(startWith({}), debounceTime(300))
            .subscribe(res => {
                this.initializeMethod();
            });
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_LIST, {});
        this.onMaterialUpladComplete();
        this.filterTypeShow = this.filterType.map(
            e => '' + e.name + ' : ' + JSON.stringify(e.value) + '\n\n'
        );
    }

    onAddMaterialDialog(): void {
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_ADD, {});
        const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: { materialId: null,filterTypeShow:this.filterTypeShow }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeMethod();
            }
        });
    }

    onEditMaterial(materialId): void {
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_EDIT, {});
        const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: { materialId,filterTypeShow:this.filterTypeShow }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeMethod();
            }
        });
    }

    onViewMaterial = materialId => {
        this.router.navigate(['/' + RouteConstant.MATERIAL_VIEW, materialId]);
    };

    onEnableClick = (isEnable, materialId) => {
        this._mixpanelService.track(
            MIXPANEL_EVENTS.MATERIAL_ENABLE_DISABLE,
            {}
        );
        const text = isEnable ? 'Enable' : 'Disable';
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: text + ' Material',
                caption: 'Are you sure you want to ' + text + ' this material?',
                primaryButtonLabel: text,
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.updateMaterialStatus(isEnable, materialId);
            }
        });
    };

    initializeMethod = () => {
        this.isLoadingResults = true;
        this.rowNumber = 1;
        this._materialService
            .listMaterial(
                getQueryParams(
                    this.getSearchParams(),
                    null,
                    this.rowNumber,
                    this.recordsPerPage
                )
            )
            .subscribe(
                response => {
                    this.handleMaterialList(response, false);
                    this.isLoadingResults = false;
                },
                err => {
                    this.isLoadingResults = false;
                }
            );
    };

    handleMaterialList = (materialList, merge) => {
        if (merge) {
            this.materialList = this.materialList.concat(
                materialList['payload']
            );
        } else {
            this.materialList = materialList['payload'];
        }
        this.rowNumber = materialList.pager
            ? materialList.pager.rowNumber + materialList['payload'].length
            : 1;
        this.totalElements = materialList.pager
            ? materialList.pager.totalRecords
            : 0;
    };

    onScroll() {
        if (this.materialList.length < this.totalElements) {
            this._materialService
                .listMaterial(
                    getQueryParams(
                        this.getSearchParams(),
                        null,
                        this.rowNumber,
                        this.recordsPerPage
                    )
                )
                .subscribe(res => {
                    this.handleMaterialList(res, true);
                });
        }
    }

    getFileIcon = type => {
        return this.fileType.filter(e => e.name == type).map(e => e.icon)[0];
    };

    updateMaterialStatus = (isEnable, matrialId) => {
        const id = isEnable ? 1 : 0;
        this._materialService
            .updateMaterialStatus({}, matrialId, id)
            .subscribe(response => {
                this.initializeMethod();
            });
    };

    getSearchParams() {
        const params = this._materialService.getMaterialFilterData();
        if (this.nameFilterField.value) {
            params['name'] = this.nameFilterField.value;
        }
        if (this.types.value && this.types.value.length) {
            const vlaue = this.types.value.map(e => e.value);
            const merged = [].concat.apply([], vlaue);
            params['file_content_type'] = merged;
        }

        return params;
    }

    async viewDownloadMaterial(
        materialId,
        materialName,
        fileType,
        typeId,
        filePath
    ) {
        if (this.youtubeType.find(e => e == fileType)) {
            this.onDocumentPreview(
                materialId,
                materialName,
                fileType,
                filePath,
                typeId
            );
        } else if (this.videoType.find(e => e == fileType)) {
            this.openDownloadMaterial(materialId, materialName, fileType);
        } else if (this.audioType.find(e => e == fileType)) {
            this.openDownloadMaterial(materialId, materialName, fileType);
        } else {
            const hasCache = await this.getCachingData(
                materialId,
                materialName,
                fileType
            );
            if (!hasCache) {
                this._materialService
                    .downloadMaterial({}, materialId)
                    .subscribe(async response => {
                        try {
                            await this.storeData(
                                materialId,
                                materialName,
                                response
                            );
                        } catch (e) {
                            console.log(e);
                        }
                        this.onDocumentPreview(
                            materialId,
                            materialName,
                            fileType,
                            response
                        );
                    });
            }
        }
    }

    openDownloadMaterial(materialId, materialName, fileType) {
        this._materialService
            .getDownloadMaterial({}, materialId)
            .subscribe(response => {
                this.onDocumentPreview(
                    materialId,
                    materialName,
                    fileType,
                    response['payload']['pre_signed_url']
                );
            });
    }

    onDocumentPreview(
        materialId,
        materialName,
        fileType,
        fileData,
        typeId?
    ): void {
        event.stopPropagation();
        if (typeId == this.materialType.Youtube) {
            const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
                panelClass: 'view-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    isAudio: false,
                    fileData,
                    isYoutube: true
                }
            });
            dialogRef.afterClosed().subscribe(result => {});
        } else if (this.videoType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
                panelClass: 'view-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    isAudio: false,
                    fileData
                }
            });
            dialogRef.afterClosed().subscribe(result => {});
        } else if (this.audioType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
                panelClass: 'view-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    isAudio: true,
                    fileData
                }
            });
            dialogRef.afterClosed().subscribe(result => {});
        } else if (this.docType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(DocMaterialViewDialogComponent, {
                panelClass: 'view-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    fileData
                }
            });
            dialogRef.afterClosed().subscribe(result => {});
        } else if (this.pdfType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(PdfMaterialDialogComponent, {
                panelClass: 'pdf-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    fileData
                }
            });
            dialogRef.afterClosed().subscribe(result => {});
        } else if (this.imageType.find(e => e == fileType)) {
            const dialogRef = this.dialog.open(ImageMaterialViewComponent, {
                panelClass: 'pdf-material-dialog-container',
                data: {
                    materialId,
                    materialName,
                    fileType,
                    fileData
                }
            });
            dialogRef.afterClosed().subscribe(result => {});
        } else {
            const link = document.createElement('a');
            let objectURL = fileData.substring
                ? fileData
                : URL.createObjectURL(fileData);
            link.setAttribute('href', objectURL);
            link.setAttribute('download', materialName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }

    getCachingData = async (materialId, materialName, fileType) => {
        if (this.forageService.isSupportCache) {
            const documentData = await this.forageService.getDocument(
                materialName + materialId
            );
            if (documentData) {
                this.onDocumentPreview(
                    materialId,
                    materialName,
                    fileType,
                    documentData
                );
                return true;
            } else {
                return false;
            }
        }
        return false;
    };

    storeData = async (materialId, materialName, response) => {
        if (this.forageService.isSupportCache) {
            const data = await this.forageService.estimateSpace();
            const blobSize = bytesToSizeInMB(response.size);
            if (data['avai'] >= blobSize) {
                await this.forageService.setDocument(
                    materialName + materialId,
                    response
                );
            }
        }
    };

    onGradeUrl = () => {
        this.router.navigate(['/' + RouteConstant.GRADE_SELECTION]);
    };

    onSubjectUrl = () => {
        this.router.navigate(['/' + RouteConstant.SUBJECT_SELECTION]);
    };

    onMaterialUpladComplete = () => {
        this.materialUploadCom$ = this._sharedUserService
            .getMaterialComplate()
            .subscribe(data => {
                if (!data) {
                    return;
                }
                if (
                    this.selectedGradeAndSubject.grade_id == data['grade_id'] &&
                    this.selectedGradeAndSubject.subject_id ==
                        data['subject_id']
                ) {
                    this.initializeMethod();
                }
            });
    };

    ngOnDestroy() {
        if (this.materialUploadCom$) {
            this.materialUploadCom$.unsubscribe();
        }
    }

    onRemoveMaterial = materialId => {
        // this._mixpanelService.track(
        //     MIXPANEL_EVENTS.MATERIAL_ENABLE_DISABLE,
        //     {}
        // );
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Remoe Material',
                caption: 'Are you sure you want to remove this material?',
                primaryButtonLabel: 'Remove',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeMaterialFile(materialId);
            }
        });
    };

    removeMaterialFile = matrialId => {
        this._materialService.removeMaterial(matrialId).subscribe(response => {
            this.initializeMethod();
        });
    };
}
