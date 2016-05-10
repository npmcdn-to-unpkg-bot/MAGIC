export class Prospect {
  constructor(
    public id:string,
    public first_name:string,
    public hometown:string,
    public photo:string,
    public age:string,
    public score:string,
    public common_likes:Array<string>
    ) { }
}