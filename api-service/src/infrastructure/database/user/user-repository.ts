import { injectable, inject } from "inversify";
import { Result } from "../../../application/contracts/result/result";
import { ResultError } from "../../../application/contracts/result/result-error";
import { ResultNotFound } from "../../../application/contracts/result/result-not-found";
import { ResultSuccess } from "../../../application/contracts/result/result-success";
import { NonFunctionProperties } from "../../../application/contracts/types";
import { User } from "../../../domain/entities/User";
import { DatabaseConnection } from "../database-connection";
import { UserEntity } from "./user-schema";

@injectable()
export class UserRepository {
  private readonly databaseConnection: DatabaseConnection;

  public constructor(@inject(DatabaseConnection) databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  public async save(user: User): Promise<Result> {
    console.log("Saving user", { data: user });

    try {
      const connection = await this.databaseConnection.getConnection();
      const result = await connection.getRepository<NonFunctionProperties<User>>(UserEntity).save(user);

      console.log("Saved user", { result });

      return new ResultSuccess(undefined);
    } catch (error) {
      console.error("Failed to save user", { error });

      return new ResultError("Failed to save user");
    }
  }

  public async findByEmail(email: string): Promise<Result> {
    console.log("Finding user by email", { email });

    try {
      const connection = await this.databaseConnection.getConnection();

      const queryBuilder = connection.manager.createQueryBuilder(UserEntity, "user").where("user.email = :email", {
        email,
      });

      const foundRawUser = await queryBuilder.getOne();

      if (foundRawUser === undefined) {
        console.log("user not found by email", { email });

        return new ResultNotFound("user not found by email");
      }

      return new ResultSuccess(undefined);
    } catch (error) {
      console.error("Failed to find user by email", { error });

      return new ResultError("Failed to find user by email");
    }
  }

  public async findById(id: string): Promise<Result<User>> {
    console.log("Finding user by id", { id });

    try {
      const connection = await this.databaseConnection.getConnection();

      const queryBuilder = connection.manager.createQueryBuilder(UserEntity, "user").where("user.id = :id", {
        id,
      });

      const foundRawUser = await queryBuilder.getOne();

      if (foundRawUser === undefined) {
        console.log("user not found by id", { id });

        return new ResultNotFound("user not found by id");
      }

      return new ResultSuccess(foundRawUser);
    } catch (error) {
      console.error("Failed to find user by id", { error });

      return new ResultError("Failed to find user by id");
    }
  }
}
