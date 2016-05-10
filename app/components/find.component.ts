import {Component} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {FindService} from '../find.service';
import {OnInit} from 'angular2/core';
import {Prospect} from '../models/prospect';

/*
type 'profile' will not be used. Will switch once server side is able to send info for this page.
*/

@Component({
  selector: 'find',
  templateUrl: './app/components/find.component.html',
  providers: [FindService]
})

export class FindComponent {

  constructor (private _findService: FindService) {}

  public prospect : Prospect;
  public errorMessage: string;

  ngOnInit() { this.getProspect(); }


  getProspect() {
   this._findService.getProspect()

     
   

    .subscribe(
      prospect => this.prospect = prospect,
      error =>  this.errorMessage = <any>error);  

    }

  postDecision(decision){
  	this._findService.postDecision(this.prospect.id,decision);
    console.log(this.prospect.id);
  	this.getProspect();

  }
}