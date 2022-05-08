export class User {
  constructor(
    public jsonToken: string,
    public role: string,
    public id: string,
    public name: string,
    public surname: string,
    public username: string,
    public email: string,
    public mobilePhone: string,
    public photo?: string
  ) {}
}
