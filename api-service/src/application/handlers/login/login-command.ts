import { NonFunctionProperties } from "../../contracts/types";

export class LoginCommand {
  public email: string;
  public password: string;

  public constructor(data: NonFunctionProperties<LoginCommand>) {
    this.email = data.email;
    this.password = data.password;
  }
}
