export class Room {
  constructor(
    public _id: String,
    public name: String,
    public type: String,
    public users: String[],
    public inCall: String[]
  ) { }
}
