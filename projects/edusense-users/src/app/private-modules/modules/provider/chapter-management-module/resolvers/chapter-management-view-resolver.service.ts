import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RouteConstant } from '@sharedModule/constants';
import { catchError, map } from 'rxjs/operators';
import { ChapterManagementService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class ChapterManagementViewResolverService {
    // Data variables
    chapterId: string;

    constructor(
        private chapterManagementService: ChapterManagementService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.chapterId = route.paramMap.get('id');
        return this.chapterManagementService
            .getChapterDetails(+this.chapterId)
            .pipe(
                map(
                    response => {
                        return {
                            chapterDetails: response['payload']
                        };
                    },
                    catchError(error => this.handleError(error))
                )
            );
    }

    // helper methods
    private handleError(error) {
        this.router.navigate(['/' + RouteConstant.CHAPTER_MANAGEMENT_LIST]);
        return of(error);
    }
}
