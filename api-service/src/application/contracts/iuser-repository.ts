import { User } from "../../domain/entities/User";
import { Result } from "./result/result";

export interface IUserRepository {
  save(user: User): Promise<Result>;
  findByEmail(email: string): Promise<Result<User>>;
  findById(id: string): Promise<Result<User>>;
}
