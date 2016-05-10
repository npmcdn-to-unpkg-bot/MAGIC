import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {ProfileComponent} from './profile.component';
import {FindComponent} from './find.component';
import {MatchesComponent} from './matches.component';
import {SettingsComponent} from './settings.component';

@Component({
  selector: 'home',
  templateUrl: './app/components/home.component.html',
  styleUrls: ['./app/css/home.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: []
})

@RouteConfig([
  {path: '/profile', name: 'Profile', component: ProfileComponent, useAsDefault: true},
  {path: '/find', name: 'Find', component: FindComponent},
  {path: '/matches', name: 'Matches', component: MatchesComponent},
  {path: '/settings', name: "Settings", component: SettingsComponent}
])

export class HomeComponent {
}