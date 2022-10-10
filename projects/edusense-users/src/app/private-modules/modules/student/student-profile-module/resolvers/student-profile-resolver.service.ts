import { Injectable } from '@angular/core';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StudentProfileService } from '../services/student-profile.service';
import { SharedUserService } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class StudentProfileResolverService {
    constructor(private _studentProfileService: StudentProfileService,
        private _sharedUserService: SharedUserService) {}

    resolve(): Observable<any> {
        const userConfig = this._sharedUserService.getUserConfig();
        return forkJoin(this._studentProfileService.getProfileDetail(userConfig.user_uuid)).pipe(
            map(
                (allResponses) => {
                    return {
                        profileDetail: allResponses[0]['payload']
                    };
                },
                catchError((error) => this.handleError(error))
            )
        );
    }

    handleError = (error) => {
        return throwError(error);
    };
}
