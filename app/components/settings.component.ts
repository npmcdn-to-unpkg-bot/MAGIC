import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {SettingsService} from './settings.service';
import {OnInit} from 'angular2/core';
import {Settings}       from '../models/settings';

@Component({
  selector: 'settings',
  templateUrl: './app/components/settings.component.html',
  styleUrls: ['./app/css/settings.css'],
  directives: [CORE_DIRECTIVES],
  providers: [SettingsService]
})

export class SettingsComponent implements OnInit {
	constructor (private _settingsService: SettingsService) {}

	public settings: Settings;
	public orientations = [
		'Men',
		'Women',
		'Both'
	];
	public errorMessage: string;

	ngOnInit() { this.getSettings(); }

	getSettings() {
	  	this._settingsService.getSettings()
	  		.subscribe(
	                     settings => this.settings = settings,
	                     error =>  this.errorMessage = <any>error);
  	}

  	postSettings() {
  		console.log(this.settings);
  		this._settingsService.postSettings(this.settings);
  	}
}