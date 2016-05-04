import {Component} from 'angular2/core';
import {AuthService} from './auth.service';

@Component({
  selector: 'auth',
  templateUrl: './app/components/auth.component.html',
  providers: [AuthService]
})

export class AuthComponent {
	constructor (private _authService: AuthService) {}

	authorize () : void {
		this._authService.authorize();
	}
}