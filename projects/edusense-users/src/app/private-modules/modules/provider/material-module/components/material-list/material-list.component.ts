import { Component, OnInit } from '@angular/core';
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
    ViewType
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
import { forkJoin, merge } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import {
    getQueryParams,
    saveFile,
    bytesToSizeInMB
} from '@sharedModule/functions';
import { MaterialGrade, MaterialSubject } from '@sharedModule/models';
import { Material } from '../../models';
import { ForageService } from '@sharedModule/services';

@Component({
    selector: 'app-material-list',
    templateUrl: './material-list.component.html',
    styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
    // Form Variables
    nameFilterField: FormControl = new FormControl('');
    grades = new FormControl();
    subjects = new FormControl();

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

    // data variable
    gradeList: MaterialGrade[] = [];
    subjectList: MaterialSubject[] = [];
    materialList: Material[] = [];
    previewImgURL: any;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private _materialService: MaterialService,
        private forageService: ForageService
    ) {}

    ngOnInit() {
        this.getGradeAndSubData();
        merge(
            this.nameFilterField.valueChanges,
            this.subjects.valueChanges,
            this.grades.valueChanges
        )
            .pipe(startWith({}), debounceTime(300))
            .subscribe(res => {
                this.initializeMethod();
            });
    }

    onAddMaterialDialog(): void {
        const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: { materialId: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeMethod();
                this.getGradeAndSubData();
            }
        });
    }

    onEditMaterial(materialId): void {
        const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: { materialId }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeMethod();
                this.getGradeAndSubData();
            }
        });
    }

    onViewMaterial = materialId => {
        this.router.navigate(['/' + RouteConstant.MATERIAL_VIEW, materialId]);
    };

    onEnableClick = (isEnable, materialId) => {
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

    getGradeAndSubData = () => {
        forkJoin([
            this._materialService.getGradeList({}),
            this._materialService.getSubList({})
        ]).subscribe(
            allResponses => {
                this.handleGradeList(allResponses[0]['payload']);
                this.handleSubjectList(allResponses[1]['payload']);
            },
            err => {
                console.log(err);
            }
        );
    };

    handleGradeList = gradeList => {
        this.gradeList = gradeList;
    };

    handleSubjectList = list => {
        this.subjectList = list;
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
        const params = {};
        if (this.nameFilterField.value) {
            params['name'] = this.nameFilterField.value;
        }
        if (this.subjects.value && this.subjects.value.length > 0) {
            params['subject_id'] = this.subjects.value.map(e => e.subject_id);
        }
        if (this.grades.value && this.grades.value.length > 0) {
            params['grade_id'] = this.grades.value.map(e => e.grade_id);
        }
        return params;
    }

    async viewDownloadMaterial(materialId, materialName, fileType) {
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

    onDocumentPreview(materialId, materialName, fileType, fileData): void {
        event.stopPropagation();
        if (this.videoType.find(e => e == fileType)) {
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
        }
        // else if (this.excelType.find(e => e == fileType)) {
        //     const dialogRef = this.dialog.open(
        //         PptExcelViewMaterialDialogComponent,
        //         {
        //             panelClass: 'view-material-dialog-container',
        //             data: {
        //                 materialId,
        //                 materialName,
        //                 fileType,
        //                 isExcel: true
        //             }
        //         }
        //     );
        //     dialogRef.afterClosed().subscribe(result => {});
        // } else if (this.pptType.find(e => e == fileType)) {
        //     const dialogRef = this.dialog.open(
        //         PptExcelViewMaterialDialogComponent,
        //         {
        //             panelClass: 'view-material-dialog-container',
        //             data: {
        //                 materialId,
        //                 materialName,
        //                 fileType,
        //                 isExcel: false
        //             }
        //         }
        //     );
        //     dialogRef.afterClosed().subscribe(result => {});
        // }
        else if (this.docType.find(e => e == fileType)) {
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
                panelClass: 'material-dialog-container',
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
            saveFile(fileData, materialName);
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
}
