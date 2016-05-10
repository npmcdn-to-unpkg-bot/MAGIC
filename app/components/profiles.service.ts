import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Profile}        from '../models/profile';

@Injectable()
export class ProfilesService {

  constructor (private http: Http) {}

  private _profileUrl = 'profile';
  private _profilesUrl = 'profiles';  // URL to web api

  getProfile (): Observable<Profile> {
    return this.http.get(this._profileUrl)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getProfiles (): Observable<Profile[]> {
    return this.http.get(this._profilesUrl)
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body || [];
  }

  private handleError (error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}