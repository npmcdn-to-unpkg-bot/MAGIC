import {Injectable}     from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Prospect}        from '../models/prospect';

@Injectable()
export class FindService {

  constructor (private http: Http) {}
  //call will be to a different server function
  private _prospectUrl = 'match';
 
  getProspects (): Observable<[Prospect]> {
    return this.http.get(this._prospectUrl)
        .map(this.extractData)
        .catch(this.handleError);
  }

  postDecision(id, decision) : any {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify({id: id, decision: decision});
    return this.http.post(this._prospectUrl, body, {
        headers: headers
      })
      .map(this.extractData)
      .catch(this.handleError);
  }

 
  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body;
  }

  private handleError (error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}