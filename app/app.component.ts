import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HomeComponent} from './components/home.component';
import {AuthComponent} from './components/auth.component';

@Component({
    selector: 'app',
    templateUrl: './app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: []
})

@RouteConfig([ 
  { path: '/', name: 'Auth', component: AuthComponent },
  { path: '/home', name: 'Home', component: HomeComponent },
  { path: '/**', redirectTo:['Auth'] }, //https://github.com/angular/angular/issues/4055
])

export class AppComponent { 
}