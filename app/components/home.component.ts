import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {ProfileComponent} from './profile.component';

@Component({
  selector: 'home',
  templateUrl: './app/components/home.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: []
})

@RouteConfig([
  {path: '/profile', name: 'Profile', component: ProfileComponent, useAsDefault: true}
])

export class HomeComponent {
}