import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        MatStepperModule,
        MatRippleModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatCardModule,
        MatDialogModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatExpansionModule,
        MatSortModule,
        MatPaginatorModule,
        MatChipsModule,
        NgxMatSelectSearchModule
    ],
    exports: [
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        MatStepperModule,
        MatRippleModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatCardModule,
        MatDialogModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatExpansionModule,
        MatSortModule,
        MatPaginatorModule,
        MatChipsModule,
        NgxMatSelectSearchModule
    ],
    providers: []
})
export class MaterialImportsModule {}
