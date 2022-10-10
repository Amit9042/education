import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    RouteConstant,
    ALLOWED_MATERIAL_FILE_TYPES,
    MATERIAL_TYPE
} from '@sharedModule/constants';
import { MatDialog } from '@angular/material/dialog';
import { MaterialService } from '../../service';
import { Material } from '../../models';
import { MIXPANEL_EVENTS } from '@sharedModule/constants';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-material-view',
    templateUrl: './material-view.component.html',
    styleUrls: ['./material-view.component.scss']
})
export class MaterialViewComponent implements OnInit {
    fileType = ALLOWED_MATERIAL_FILE_TYPES;
    materialType = MATERIAL_TYPE;
    currentMaterialId: number;
    curruntMaterial: Material;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _route: ActivatedRoute,
        private _materialService: MaterialService,
        private _mixpanelService: MixpanelService
    ) {}

    ngOnInit() {
        this._route.paramMap.subscribe((params) => {
            this.currentMaterialId = +params['params']['id'];
            this.getDetail();
        });
        this._mixpanelService.track(MIXPANEL_EVENTS.MATERIAL_DETAIL, {});
    }

    onMaterialList = () => {
        this.router.navigate(['/' + RouteConstant.MATERIAL_SELECTION]);
    };

    getDetail = () => {
        this._materialService
            .getMaterialDetails(this.currentMaterialId)
            .subscribe((response) => {
                this.curruntMaterial = response['payload'];
            });
    };

    getFileIcon = (type) => {
        return this.fileType
            .filter((e) => e.name == type)
            .map((e) => e.icon)[0];
    };
}
