import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ConfirmationMessageDialogComponent,
    FormBaseComponent,
    NoDataComponent,
    PaginationComponent,
    MaterialTableComponent,
    SelectSearchComponent,
    StreamingComponent,
    ImageMaterialViewComponent,
    PdfMaterialDialogComponent,
    ViewMaterialDialogComponent,
    PptExcelViewMaterialDialogComponent,
    DocMaterialViewDialogComponent,
    ChatComponent,
    SlowInternetConnectionComponent
} from '@sharedModule/components';
import { FocusDirective } from '@sharedModule/directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialImportsModule } from '@sharedModule/modules';
import { CheckEmptyPipe, PlaceNAPipe, KeysPipe } from '@sharedModule/pipes';
import { HttpInterceptors } from '@sharedModule/http-interceptors';
import { EditEmailDialogComponent } from './components/dialogs/edit-email-dialog/edit-email-dialog.component';
import { EmailOtpDialogComponent } from './components/dialogs/email-otp-dialog/email-otp-dialog.component';
import { CreateClassDialogComponent } from './components/dialogs/create-class-dialog/create-class-dialog.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EditMobileDialogComponent } from './components/dialogs/edit-mobile-dialog/edit-mobile-dialog.component';
import { MobileOtpDialogComponent } from './components/dialogs/mobile-otp-dialog/mobile-otp-dialog.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ClickOutsideDirective } from './directives/outside-click.directive';
import { DataLoadingComponent } from './components/data-loading/data-loading.component';
// tslint:disable-next-line: max-line-length
import { AssignmentDetailsContentViewComponent } from './components/assignment-details-content-view/assignment-details-content-view.component';
import { QuillModule } from 'ngx-quill';
import {NgxPaginationModule} from 'ngx-pagination';
import { DurationPipe } from './pipes/duration.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';

@NgModule({
    declarations: [
        FormBaseComponent,
        NoDataComponent,
        PaginationComponent,
        ConfirmationMessageDialogComponent,
        CheckEmptyPipe,
        PlaceNAPipe,
        KeysPipe,
        FocusDirective,
        MaterialTableComponent,
        SelectSearchComponent,
        EditEmailDialogComponent,
        EmailOtpDialogComponent,
        CreateClassDialogComponent,
        EditMobileDialogComponent,
        MobileOtpDialogComponent,
        ImageMaterialViewComponent,
        PdfMaterialDialogComponent,
        ViewMaterialDialogComponent,
        PptExcelViewMaterialDialogComponent,
        DocMaterialViewDialogComponent,
        ChatComponent,
        StreamingComponent,
        DataLoadingComponent,
        ClickOutsideDirective,
        SlowInternetConnectionComponent,
        AssignmentDetailsContentViewComponent,
        DurationPipe,
        EllipsisPipe
    ],
    imports: [
        CommonModule,
        MaterialImportsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        NgxMaterialTimepickerModule,
        QuillModule.forRoot(),
        NgxPaginationModule,
        PdfViewerModule
    ],
    providers: [HttpInterceptors],
    exports: [
        FormBaseComponent,
        NoDataComponent,
        PaginationComponent,
        ConfirmationMessageDialogComponent,
        CheckEmptyPipe,
        PlaceNAPipe,
        KeysPipe,
        MaterialImportsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FocusDirective,
        SelectSearchComponent,
        EditMobileDialogComponent,
        MobileOtpDialogComponent,
        ImageMaterialViewComponent,
        PdfMaterialDialogComponent,
        ViewMaterialDialogComponent,
        StreamingComponent,
        PptExcelViewMaterialDialogComponent,
        PdfViewerModule,
        DocMaterialViewDialogComponent,
        InfiniteScrollModule,
        DataLoadingComponent,
        ClickOutsideDirective,
        SlowInternetConnectionComponent,
        NgxPaginationModule,
        QuillModule,
        AssignmentDetailsContentViewComponent,
        DurationPipe,
        EllipsisPipe
    ],
    entryComponents: [
        ConfirmationMessageDialogComponent,
        CreateClassDialogComponent,
        EditEmailDialogComponent,
        EmailOtpDialogComponent,
        EditMobileDialogComponent,
        MobileOtpDialogComponent,
        PdfMaterialDialogComponent,
        ViewMaterialDialogComponent,
        PptExcelViewMaterialDialogComponent,
        ImageMaterialViewComponent,
        DocMaterialViewDialogComponent,
        AssignmentDetailsContentViewComponent
    ]
})
export class SharedModule {}
