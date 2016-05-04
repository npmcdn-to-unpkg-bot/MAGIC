import {Component} from 'angular2/core';
import {AuthService} from './auth.service';
import {ProfilesComponent} from './profiles.component';

@Component({
  selector: 'auth',
  templateUrl: './app/components/auth.component.html',
  directives: [ProfilesComponent],
  providers: [AuthService]
})

export class AuthComponent {
	constructor (private _authService: AuthService) {}

	authorize () : void {
		this._authService.authorize();
	}
}