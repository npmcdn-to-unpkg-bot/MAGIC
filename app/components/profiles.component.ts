import {Component} from 'angular2/core';
import {Profile} from '../models/profile';
import {ProfilesService} from '../profiles.service';
import {OnInit} from 'angular2/core';
import {CAROUSEL_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'profiles',
    templateUrl: './app/components/profiles.component.html',
    styleUrls: ['./app/css/profiles.css'],
    directives: [CAROUSEL_DIRECTIVES],
    providers: [
    	ProfilesService
    ]
})

export class ProfilesComponent implements OnInit { 

	constructor (private _profilesService: ProfilesService) {}

	public myInterval:number = 5000;
	public noWrapSlides:boolean = false;

	public profiles: Profile[];
	public errorMessage: string;

	ngOnInit() { this.getProfiles(); }

	getProfiles() {
  	this._profilesService.getProfiles()
  		.subscribe(
                     profiles => this.profiles = profiles,
                     error =>  this.errorMessage = <any>error);
  }
}