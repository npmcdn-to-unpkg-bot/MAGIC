import {Injectable}     from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Match}          from '../models/match';
import {Message} from '../models/message';

@Injectable()
export class MatchesService {

  constructor (private http: Http) {}

  private _matchesUrl = 'matches';
  private _messagesUrl = 'messages';  // URL to web api

  getMatches (): Observable<[Match]> {
    return this.http.get(this._matchesUrl)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getMessages (id: string): Observable<[Message]> {
    return this.http.get(this._messagesUrl + '/' + id)
    .map(this.extractData)
    .catch(this.handleError);
  }

  postMessage (id: string, message: string) : any {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let test = JSON.stringify({id: id, message: message});
    console.log(test);
    return this.http.post(this._messagesUrl, test, {
        headers: headers
      }).map(this.extractData)
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