import { Injectable } from '@angular/core';
import { ProfileService } from '../../services/profile-service/profile.service';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentProfileResolverService {

  constructor(private _profileService: ProfileService) { }

  resolve(): Observable<any> {
    const param = {'showAll': true};
    return forkJoin(
      this._profileService.getGradeList(param),
      this._profileService.getProviderTypeList(param),
      this._profileService.getCountryList(param),      
    ).pipe(
      map(allresponse => {
        return {
          gradeList: allresponse[0]['payload'],
          providerTypeList: allresponse[1]['payload'],
          countryList: allresponse[2]['payload']
        };
      },
        catchError(error => this.handleError(error))
      ));
  }

  handleError = (error) => {
    return throwError(error);
  }
}

