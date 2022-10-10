import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MaterialService } from '../../student-material-module/service';
import { catchError, map } from 'rxjs/operators';
import { SharedService } from '@sharedModule/services';
import { AllDoubtService } from '../../student-doubts-module/services';

@Injectable({
    providedIn: 'root'
})
export class ChooseSubjectPracticeResolverService {
    // Data variables
    providerUUID: string;

    constructor(
        private materialService: MaterialService,
        private sharedService: SharedService,
        private allDoubtService: AllDoubtService
    ) {}

    resolve(): Observable<any> {
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
        return this.allDoubtService
            .getSubList({ providerUUID: this.providerUUID })
            .pipe(
                map(
                    (response) => {
                        return {
                            subjectList: response['payload']
                        };
                    },
                    catchError((error) => this.handleError(error))
                )
            );
    }

    // helper methods
    private handleError(error) {
        return of(error);
    }
}
