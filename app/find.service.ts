import {Injectable}     from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Profile}        from './models/profile';

@Injectable()
export class FindService {

  decision: boolean;

  constructor (private http: Http) {}
 //call will be to a different server function
  private _prospectUrl = 'profile';
  private _matchingUrl = 'match';
 
  getProspect (): Observable<Profile> {
    return this.http.get(this._prospectUrl)
    .map(this.extractData)
    .catch(this.handleError);
  }

  postDecision(decision){
   
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let test = JSON.stringify({decision: decision});
    console.log(test);
    this.http.post(this._matchingUrl, test, {
        headers: headers
      }).map(this.extractData)
      .catch(this.handleError)
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );

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