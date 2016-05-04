import {Component} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {ProfilesService} from '../profiles.service';
import {OnInit} from 'angular2/core';
import {Profile} from '../models/profile';

@Component({
  selector: 'home',
  templateUrl: './app/components/home.html',
  providers: [
  	ProfilesService
  ]
})

export class HomeComponent {

	constructor (private _profilesService: ProfilesService) {}

	public profile : Profile;
	public errorMessage: string;

	ngOnInit() { this.getProfile(); }

  	getProfile() {
    	this._profilesService.getProfile()
    		.subscribe(
                       profile => this.profile = profile,
                       error =>  this.errorMessage = <any>error);
  }
}