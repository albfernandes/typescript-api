import { NonFunctionProperties } from "../contracts/types";

export class AuthenticateUserCommand {
  public token: string;
  public validRoles: string[];

  public constructor(data: NonFunctionProperties<AuthenticateUserCommand>) {
    this.token = data.token;
    this.validRoles = data.validRoles;
  }
}
