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
    try {
      const connection = await this.databaseConnection.getConnection();
      await connection.getRepository<NonFunctionProperties<User>>(UserEntity).save(user);

      return new ResultSuccess(undefined);
    } catch (error) {
      return new ResultError("Failed to save user");
    }
  }

  public async findByEmail(email: string): Promise<Result> {
    try {
      const connection = await this.databaseConnection.getConnection();

      const queryBuilder = connection.manager.createQueryBuilder(UserEntity, "user").where("user.email = :email", {
        email,
      });

      const foundRawUser = await queryBuilder.getOne();

      if (foundRawUser === undefined) {
        return new ResultNotFound("user not found by email");
      }

      return new ResultSuccess(undefined);
    } catch (error) {
      return new ResultError("Failed to find user by email");
    }
  }

  public async findById(id: string): Promise<Result<User>> {
    try {
      const connection = await this.databaseConnection.getConnection();

      const queryBuilder = connection.manager.createQueryBuilder(UserEntity, "user").where("user.id = :id", {
        id,
      });

      const foundRawUser = await queryBuilder.getOne();

      if (foundRawUser === undefined) {
        return new ResultNotFound("user not found by id");
      }

      return new ResultSuccess(foundRawUser);
    } catch (error) {
      return new ResultError("Failed to find user by id");
    }
  }
}
