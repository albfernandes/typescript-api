import { RoleEnum } from "../../../domain/enums/Role";
import { NonFunctionProperties } from "../../contracts/types";

export class RegisterUserCommand {
  public email: string;
  public role: RoleEnum;
  public password: string;

  public constructor(data: NonFunctionProperties<RegisterUserCommand>) {
    this.email = data.email;
    this.role = data.role;
    this.password = data.password;
  }
}
