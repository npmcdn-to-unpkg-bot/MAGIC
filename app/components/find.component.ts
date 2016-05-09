import {Component} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {FindService} from '../find.service';
import {OnInit} from 'angular2/core';
import {Profile} from '../models/profile';

/*
type 'profile' will not be used. Will switch once server side is able to send info for this page.
*/

@Component({
  selector: 'find',
  templateUrl: './app/components/find.component.html',
  providers: [FindService]
})

export class FindComponent {

  constructor (private _profilesService: FindService) {}

  public profile : Profile;
  public errorMessage: string;

  ngOnInit() { this.getProspect(); }


  getProspect() {
    this._profilesService.getProspect()
    .subscribe(
      profile => this.profile = profile,
      error =>  this.errorMessage = <any>error);
  }

  postChoice(choice){
  	this._profilesService.postDecision(choice);
    console.log(this.profile.id);
  	this.getProspect();

  }
}