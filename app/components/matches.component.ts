import {Component} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {MatchesService} from './matches.service';
import {OnInit} from 'angular2/core';
import {Match} from '../models/match';
import {Message} from '../models/message';

@Component({
  selector: 'matches',
  templateUrl: './app/components/matches.component.html',
  styleUrls: ['./app/css/matches.css'],
  providers: [MatchesService]
})

export class MatchesComponent {
	constructor (private _matchesService: MatchesService) {}

	public matches : [Match];
	public selection : Match;
	public messages : any;
	public newMessage: string;
	public errorMessage: string;

	ngOnInit() { 
		this.getMatches();
		setInterval(() => {
			this.getMatches();
		}, 5000);
		setInterval(() => {
			if(this.selection) {
				this.getMessages();
			}
		}, 1000);
	}

	getMatches() {
		this._matchesService.getMatches()
		.subscribe(
		  matches => this.matches = matches,
		  error =>  this.errorMessage = <any>error);

	}

	makeSelection(match : Match) {
		this.selection = match;
		this.getMessages();
	}

	getMessages() {
		this._matchesService.getMessages(this.selection.id)
		.subscribe(
		  messages => {
		  	this.messages = messages
		  	.sort(function (a, b) : number {
		  		return a.timestamp.localeCompare(b.timestamp);
		  	})
		  	.map(message => {
		  		return new Message(
		  			message.fromId,
		  			message.toId,
		  			message.message,
		  			new Date(message.timestamp)
		  		);
		  	});
		  },
		  error =>  this.errorMessage = <any>error);
	}

	postMessage() {
		this._matchesService.postMessage(this.selection.id, this.newMessage)
		.subscribe(
	        success => {
	        	this.newMessage = "";
	            this.getMessages();
	        },
	        error => this.errorMessage = error
      	);
	}



	// getMessages(id : String) {
	// 	this._matchesService.getMessages(id)
	// 		.subscribe(
	// 	  matched => this.matched = matched,
	// 	  error =>  this.errorMessage = <any>error);
	// }
}