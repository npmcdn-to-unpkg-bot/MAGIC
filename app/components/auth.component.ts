import {Component} from 'angular2/core';
import {ProfilesComponent} from './profiles.component';

@Component({
  selector: 'auth',
  templateUrl: './app/components/auth.component.html',
  styleUrls: ['./app/css/auth.css'],
  directives: [ProfilesComponent],
  providers: []
})

export class AuthComponent {}