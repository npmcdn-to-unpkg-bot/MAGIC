import {Component} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {MatchesService} from '../matches.service';
import {OnInit} from 'angular2/core';
import {Profile} from '../models/profile';

@Component({
  selector: 'matches',
  templateUrl: './app/components/matches.component.html',
  styleUrls: ['./app/css/matches.css'],
  providers: [MatchesService]
})

export class MatchesComponent {
	constructor (private _matchesService: MatchesService) {}

	public matched : [String];
	public errorMessage: string;

	ngOnInit() { this.getMatched(); }

	getMatched() {
	this._matchesService.getMatched()
	.subscribe(
	  matched => this.matched = matched,
	  error =>  this.errorMessage = <any>error);
	}
}