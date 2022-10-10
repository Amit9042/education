import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminRouteConstant } from '../../../../../_shared/constants';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditProviderDialogComponent } from '../edit-provider-dialog/edit-provider-dialog.component';
import { ConfirmationMessageDialogComponent } from 'utility-lib';
import { merge, throwError } from 'rxjs';
import { startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { PAGE_SIZE_OPTIONS, getQueryParams } from 'utility-lib';
import { ProviderListService } from '../../services';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ProviderStatusList, ProviderTypeList, ProviderStatusEnum } from '../../../../../_shared/constants';
import { ProviderListModel } from '../../models';

export interface PeriodicElement {
    name: string;
    email: string;
    provider_name: string;
    type: string;
    location: string;
    status: string;
    action: string;
    actionButtons: string;
}

@Component({
    selector: 'es-admin-provider-list',
    templateUrl: './provider-list.component.html',
    styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {
    // Angular Variables
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // Form Variables
    nameFilterField = new FormControl('');
    emailFilterField = new FormControl('');
    providerFilterField = new FormControl('');
    locationFilterField = new FormControl('');
    typeFilterField = new FormControl('All');
    statusFilterField = new FormControl('All');
    actionFilterField = new FormControl('All');

    displayedColumns: string[] = [
        'name',
        'email',
        'provider_name',
        'type',
        'location',
        'status',
        'action',
        'actionButtons'
    ];

    providerStatus = ProviderStatusEnum;
    providerStatusList = ProviderStatusList;
    providerTypes = ProviderTypeList;
    providerList: ProviderListModel[] = [];

    // state Variable
    isLoadingResults = false;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(private router: Router, public dialog: MatDialog,
        private providerListService: ProviderListService) {}

    ngOnInit(): void {
        this.initializeMethod();
    }

    initializeMethod = () => {
        this.isLoadingResults = true;
        merge(
            this.sort.sortChange,
            this.nameFilterField.valueChanges,
            this.emailFilterField.valueChanges,
            this.providerFilterField.valueChanges,
            this.locationFilterField.valueChanges,
            this.actionFilterField.valueChanges,
            this.typeFilterField.valueChanges,
            this.statusFilterField.valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    return this.getProviderList();
                }),
                catchError(error => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe(response => {
                this.handleProviderList(response['payload'], response['pager']);
                this.isLoadingResults = false;
            });
    };

    getProviderList = () => {
        return this.providerListService.providerList(
            getQueryParams(
                this.getSearchParams(),
                this.sort,
                this.rowNumber,
                this.recordsPerPage
            )
        );
    };

    getList = () => {
        this.isLoadingResults = true;
        this.getProviderList().subscribe(response => {
            this.handleProviderList(response['payload'], response['pager']);
            this.isLoadingResults = false;
        })
    }

    getSearchParams() {
        const params = {};
        if (this.nameFilterField.value) {
            params['name'] = this.nameFilterField.value;
        }
        if (this.emailFilterField.value) {
            params['email'] = this.emailFilterField.value;
        }
        if (this.providerFilterField.value) {
            params['provider_name'] = this.providerFilterField.value;
        }
        if (this.typeFilterField.value !== 'All') {
            params['provider_type_id'] = this.typeFilterField.value;
        }
        if (this.locationFilterField.value) {
            params['city_name'] = this.locationFilterField.value;
        }
        if (this.statusFilterField.value !== 'All') {
            params['status'] = this.statusFilterField.value;
        }
        if (this.actionFilterField.value !== 'All') {
            params['is_active'] = this.actionFilterField.value;
        }
        return params;
    }

    handleProviderList = (providerList, pager) => {
        this.providerList = providerList;
        this.totalElements = pager['totalRecords'];
    };

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.getList();
    };

    OpenEditUserDialog() {
        const dialogRef = this.dialog.open(EditProviderDialogComponent, {
            panelClass: 'dialog-container',
            data: {}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    onApproveClick = (element) => {
        const text = 'Approve';
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: text + ' Institute',
                caption: 'Are you sure you want to ' + text + ' Institute?',
                primaryButtonLabel: text,
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getList();
            }
        });
    };

    onRejectClick = (element) => {
        const text = 'Reject';
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: text + ' Institute',
                caption: 'Are you sure you want to ' + text + ' Institute?',
                primaryButtonLabel: text,
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getList();
            }
        });
    };

    onViewUser() {
        this.router.navigate(['/' + AdminRouteConstant.PROVIDER_VIEW]);
    }

    prepareApproveRejectRequestParam = (element, action) => {
        const param = {};
        param['provider_uuid'] = element['provider_uuid'];
        param['action'] = action;
        
        return param;
    }

    getLocation = (element) => {
        if (element.city && element.state && element.country) {
            return `${element.city.city_name}, ${element.state.state_name}, ${element.country.country_name}`;
        } else {
            return '-';
        }
    }

    getProviderStatus = (element) => {
        return this.providerStatusList.filter(item => item.id === element.status)
                .map(item => item.status).toString();
    }

    getProviderType = (element) => {
        return this.providerTypes.filter(item => item.id === element.provider_type_id)
                .map(item => item.value).toString();
    }

    updateUserStatus = (event: MatSlideToggleChange, providerDetail) => {
        const param = {
            'provider_uuid' : providerDetail?.provider_uuid,
            'action' : providerDetail?.is_active === 1 ? 0 : 1
        }
        this.providerListService.enableDisableProvider(param).subscribe(response => {
            this.providerList.forEach(item => {
                if (item.provider_uuid === providerDetail.provider_uuid) {
                    item.is_active = item.is_active === 1 ? 0 : 1;
                }
            })
        });
    }
}
