import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

@Injectable()
export class AuthService {
	constructor (private http: Http) {}

	authorize () : void {
		this.http.get('auth/facebook').subscribe(
			res => console.log(res.status),
			err => console.log(err)
		);
	}
}