export class Message {
  constructor(
    public fromId: string,
    public toId: string,
    public message: string,
    public timestamp: string) { }
}