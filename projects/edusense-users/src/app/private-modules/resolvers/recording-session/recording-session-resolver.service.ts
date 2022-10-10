import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, throwError } from 'rxjs';
import {
    HttpMethodsTypeEnum,
    ApplicationApi,
    OperatorEnum,
    UserTypeEnum
} from '@sharedModule/constants';
import { APIManager, SharedService } from '@sharedModule/services';
import { catchError, map } from 'rxjs/operators';
import { ClassesService } from '../../modules/provider/classes-module/service/classes.service';
import { UsersService } from '../../modules/provider/user-management-module/service';
import { getQueryParams } from '@sharedModule/functions';

@Injectable({
    providedIn: 'root'
})
export class RecordingSessionResolver {
    constructor(
        private sharedService: SharedService,
        protected classesService: ClassesService,
        protected usersService: UsersService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const config = this.sharedService.getUserConfig();
        const providerId = config['provider_list'][0]['provider_id'];

        const userList = this.usersService.getlist({
            ...getQueryParams({ is_active: 1 }, null, 1, 100, true),
            provider_id: providerId,
            isOwner: true,
            showAll: true
        });
        const roleList = this.usersService.getRoles(this.queryParams());
        const subjectList = this.classesService.getSubjectList({
            showAll: true
        });
        const classList = this.classesService.listClass({
            provider_id: providerId,
            showAll: true
        });
        return forkJoin([userList, subjectList, classList, roleList]).pipe(
            map(
                allResponses => {
                    return {
                        userList: allResponses[0]['payload'],
                        subjectList: allResponses[1]['payload'],
                        classList: allResponses[2]['payload'],
                        roleList: allResponses[3]['payload']['content']
                    };
                },
                catchError(error => throwError(error))
            )
        );
    }

    queryParams = (): any => {
        const criteriaArray = [];

        criteriaArray.push({
            column: 'applicationType',
            operator: OperatorEnum.EQUALS,
            values: [UserTypeEnum.PROVIDER]
        });

        criteriaArray.push({
            column: 'systemDefined',
            operator: OperatorEnum.TRUE
        });

        // criteriaArray.push({
        //     column: 'visible',
        //     operator: OperatorEnum.TRUE
        // });

        criteriaArray.push({
            column: 'active',
            operator: OperatorEnum.TRUE
        });

        return {
            offset: 0,
            limit: 100,
            criteria: criteriaArray
        };
    };
}
