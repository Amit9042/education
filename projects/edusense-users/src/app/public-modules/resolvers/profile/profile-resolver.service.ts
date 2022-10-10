import { Injectable } from '@angular/core';
import { ProfileService } from '../../services/profile-service/profile.service';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService {

  constructor(private _profileService: ProfileService) { }

  resolve(): Observable<any> {
    const param = {'showAll': true};
    return forkJoin(
      this._profileService.getGradeList(param),
      this._profileService.getBoardList(param),
      this._profileService.getMediumList(param),
      this._profileService.getSubjectList(param),
      this._profileService.getProviderTypeList(param),
      this._profileService.getCountryList(param)
    ).pipe(
      map(allresponse => {
        return {
          gradeList: allresponse[0]['payload'],
          boardList: allresponse[1]['payload'],
          mediumList: allresponse[2]['payload'],
          subjectList: allresponse[3]['payload'],
          providerTypeList: allresponse[4]['payload'],
          countryList: allresponse[5]['payload']
        };
      },
        catchError(error => this.handleError(error))
      ));
  }

  handleError = (error) => {
    return throwError(error);
  }
}
