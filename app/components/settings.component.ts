import {Component} from 'angular2/core';
import {SettingsService} from './settings.service';
import {OnInit} from 'angular2/core';
import {Settings}       from '../models/settings';

@Component({
  selector: 'settings',
  templateUrl: './app/components/settings.component.html',
  providers: [SettingsService]
})

export class SettingsComponent implements OnInit {
	constructor (private _settingsService: SettingsService) {}

	public settings: Settings;
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