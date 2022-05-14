import { NonFunctionProperties } from "../../application/contracts/types";
import { RoleEnum } from "../enums/Role";
import { v4 as uuid } from "uuid";

type CreateUserParams = Omit<NonFunctionProperties<User>, "createdAt" | "id">;

export class User {
  public readonly email: string;
  public readonly password: string;
  public readonly role: RoleEnum;
  public readonly id: string;
  public readonly createdAt: Date;

  public constructor(data: NonFunctionProperties<User>) {
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.id = data.id;
    this.createdAt = data.createdAt;
  }

  public static create(data: CreateUserParams): User {
    return new User({
      email: data.email,
      password: data.password,
      role: data.role,
      createdAt: new Date(),
      id: uuid(),
    });
  }
}
