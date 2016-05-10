import {Component} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {FindService} from './find.service';
import {OnInit} from 'angular2/core';
import {Prospect} from '../models/prospect';

/*
type 'profile' will not be used. Will switch once server side is able to send info for this page.
*/

@Component({
  selector: 'find',
  templateUrl: './app/components/find.component.html',
  styleUrls: ['./app/css/find.css'],
  providers: [FindService]
})

export class FindComponent {

  constructor (private _findService: FindService) {}

  public prospects : [Prospect];
  public errorMessage: string;

  ngOnInit() { this.getProspects(); }

  getProspects() {
   this._findService.getProspects()
    .subscribe(
        prospects => {
          this.prospects = prospects;
        },
        error =>  this.errorMessage = error
      );  
    }
    

  postDecision(decision) {
  	this._findService.postDecision(this.prospects[0].id, decision)
      .subscribe(
        success => {
          this.prospects.shift();
          if(this.prospects.length === 0)
              this.getProspects();
        },
        error => this.errorMessage = error
      );
  }
}