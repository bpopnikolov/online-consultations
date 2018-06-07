export class Teacher {
  constructor(
    public _id: string,
    public firstName: string,
    public lastName: string,
    public role: string,
    public email: string,
    public profileInfo: { phone: string, consultationsTime: string, }
  ) { }
}
