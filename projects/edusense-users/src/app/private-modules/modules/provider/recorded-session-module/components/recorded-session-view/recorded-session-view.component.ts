import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from '@sharedModule/services';
import { RecordingSessionModel } from '../../../../../models/recording-sessions.model';
import { ProviderRecordingService } from '../../../../../services/provider-recording/provider-recording.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewMaterialDialogComponent } from '@sharedModule/components';

@Component({
    selector: 'app-recorded-session-view',
    templateUrl: './recorded-session-view.component.html',
    styleUrls: ['./recorded-session-view.component.scss']
})
export class RecordedSessionViewComponent implements OnInit, OnDestroy {
    sessionDetail: RecordingSessionModel = null;

    constructor(
        public dialog: MatDialog,
        protected sharedService: SharedService,
        protected location: Location,
        protected providerRecordingService: ProviderRecordingService
    ) {}

    ngOnInit(): void {
        this.getSessionDetails();
    }

    getSessionDetails() {
        const recId = this.sharedService.getRecordingSessionId();
        this.providerRecordingService
            .getRecordingSession(recId)
            .subscribe((response) => {
                this.sessionDetail = response.payload;
            });
    }

    onRecordedlList = () => {
        this.location.back();
    };

    onVideoPreview(): void {
        this.providerRecordingService
            .getRecordingSessionStream(this.sessionDetail.recording_id)
            .subscribe((response) => {
                const detail = response.payload;
                const fileName =
                    detail.class_details.name +
                    ' - ' +
                    new Date(detail.created_at).toLocaleString();
                const data = {
                    materialId: detail.recording_id,
                    materialName: fileName,
                    fileType: detail.mime_type,
                    fileData: detail.recording_path,
                    isAudio: false
                };
                this.openVideoPreviewDialog(data);
            });
    }

    openVideoPreviewDialog(data) {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ViewMaterialDialogComponent, {
            panelClass: 'view-material-dialog-container',
            data
        });
        dialogRef.afterClosed().subscribe((result) => {});
    }

    ngOnDestroy(): void {
        this.sharedService.setRecordingSessionId(0);
    }
}
