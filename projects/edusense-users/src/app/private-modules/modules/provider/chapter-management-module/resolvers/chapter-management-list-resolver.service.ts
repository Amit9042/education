import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MaterialService } from '../../material-module/service';

@Injectable({
    providedIn: 'root'
})
export class ChapterManagementListResolverService {
    constructor(private materialService: MaterialService) {}

    resolve(): Observable<any> {
        const param = { showAll: true };
        return forkJoin(
            this.materialService.getGradeList(param),
            this.materialService.getSubList(param)
        ).pipe(
            map(
                allResponse => {
                    return {
                        gradeList: allResponse[0]['payload'],
                        subjectList: allResponse[1]['payload']
                    };
                },
                catchError(error => this.handleError(error))
            )
        );
    }

    handleError = error => {
        return throwError(error);
    };
}
