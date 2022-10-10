import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PAGE_SIZE_OPTIONS,
  ALLOWED_MATERIAL_FILE_TYPES,
  ALLOWED_MATERIAL_VIDEO_FILE_TYPES,
  ALLOWED_MATERIAL_IMAGE_FILE_TYPES,
  ALLOWED_MATERIAL_PDF_FILE_TYPES,
  ALLOWED_MATERIAL_AUDIO_FILE_TYPES,
  ALLOWED_MATERIAL_EXCEL_FILE_TYPES,
  ALLOWED_MATERIAL_DOC_FILE_TYPES,
  ALLOWED_MATERIAL_PPT_FILE_TYPES,
  RouteConstant,
  ALLOWED_MATERIAL_TXT_FILE_TYPES,
  ALLOWED_MATERIAL_ZIP_FILE_TYPES,
  MIXPANEL_EVENTS,
  MATERIAL_TYPE,
  ALLOWED_MATERIAL_YOUTUBE_FILE_TYPES
} from '@sharedModule/constants';

import { Material } from '../../models';
import { MaterialService } from '../../service';
import { merge } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import {
  getQueryParams,
  saveFile,
  bytesToSizeInMB
} from '@sharedModule/functions';
import { ForageService, SharedService } from '@sharedModule/services';
import {
  ViewMaterialDialogComponent,
  PdfMaterialDialogComponent,
  ImageMaterialViewComponent,
  DocMaterialViewDialogComponent
} from '@sharedModule/components';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
  selector: 'app-student-material-list',
  templateUrl: './student-material-list.component.html',
  styleUrls: ['./student-material-list.component.scss']
})
export class StudentMaterialListComponent implements OnInit {
  // Form Variables
  nameFilterField: FormControl = new FormControl('');
  types = new FormControl();

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
  materialType = MATERIAL_TYPE;

  //data variable
  materialList: Material[] = [];
  filterType = [];

  // Pagination related variables
  totalElements = 0;
  recordsPerPage = PAGE_SIZE_OPTIONS[0];
  rowNumber = 1;
  selectedGradeAndSubject;
  selectedMaterialId;
  providerUUID: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _materialService: MaterialService,
    private forageService: ForageService,
    private _mixpanelService: MixpanelService,
    private route: ActivatedRoute,
    private _sharedService: SharedService
  ) {
  }

  ngOnInit() {
    this.providerUUID = this._sharedService.getActiveEnterprise().provider_uuid;
    this.checkMaterialId();
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
      .pipe(startWith({}), debounceTime(500))
      .subscribe(res => {
        this.initializeMethod();
      });
    this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_LIST_STUD, {});
  }

  checkMaterialId = () => {
    this.route.queryParams.subscribe(params => {
      this.selectedMaterialId = params['id'];
    });
  };
  initializeMethod = () => {
    this.isLoadingResults = true;
    this.rowNumber = 1;
    const params = getQueryParams(
      this.getSearchParams(),
      null,
      this.rowNumber,
      this.recordsPerPage
    )
    params['providerUUID'] = this.providerUUID;
    this._materialService
      .listMaterial(params)
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

  handleMaterialList = (materialList, merge) => {
    if (merge) {
      this.materialList = this.materialList.concat(
        materialList['payload']
      );
    } else {
      this.materialList = materialList['payload'];
      if (this.selectedMaterialId) {
        const material = this.materialList.find(
          e => e.material_id == this.selectedMaterialId
        );
        if (material) {
          this.viewDownloadMaterial(
            material.material_id,
            material.original_file_name,
            material.file_content_type,
            material.material_type_id,
            material.file_path
          );
        }
      }
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
        const params = {providerUUID: this.providerUUID}
        this._materialService
          .downloadMaterial(params, materialId)
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

  onDocumentPreview(
    materialId,
    materialName,
    fileType,
    fileData,
    typeId?
  ): void {
    event.stopPropagation();
    if (this.youtubeType.find(e => e == fileType)) {
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
      dialogRef.afterClosed().subscribe(result => {
      });
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
      dialogRef.afterClosed().subscribe(result => {
      });
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
      dialogRef.afterClosed().subscribe(result => {
      });
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
      dialogRef.afterClosed().subscribe(result => {
      });
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
      dialogRef.afterClosed().subscribe(result => {
      });
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
      dialogRef.afterClosed().subscribe(result => {
      });
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

  onSubjectUrl = () => {
    this.router.navigate(['/' + RouteConstant.STUDENT_SUBJECT_SELECTION]);
  };

  openDownloadMaterial(materialId, materialName, fileType) {
    const params = { providerUUID : this.providerUUID }
    this._materialService
      .getDownloadMaterial(params, materialId)
      .subscribe(response => {
        this.onDocumentPreview(
          materialId,
          materialName,
          fileType,
          response['payload']['pre_signed_url']
        );
      });
  }
}
