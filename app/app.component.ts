import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HomeComponent} from './components/home.component';
import {TestComponent} from './components/test.component';
import {ProfilesComponent} from './components/profiles.component';
import {AuthComponent} from './components/auth.component';

@Component({
    selector: 'app',
    templateUrl: './app/app.component.html',
    directives: [ROUTER_DIRECTIVES, ProfilesComponent, AuthComponent],
    providers: []
})

@RouteConfig([ 
  { path: '/home', name: 'Home', component: HomeComponent },
  { path: '/test', name: 'Test', component: TestComponent },
  { path: '/**', redirectTo:['Test'] }, //https://github.com/angular/angular/issues/4055
])

export class AppComponent { 
}