import { injectable, inject } from "inversify";
import { IHistoryRepository } from "../../../application/contracts/ihistory-repository";
import { Result } from "../../../application/contracts/result/result";
import { ResultError } from "../../../application/contracts/result/result-error";
import { ResultSuccess } from "../../../application/contracts/result/result-success";
import { NonFunctionProperties } from "../../../application/contracts/types";
import { History } from "../../../domain/entities/History";
import { DatabaseConnection } from "../database-connection";
import { HistoryEntity } from "./history-schema";

@injectable()
export class HistoryRepository implements IHistoryRepository {
  private readonly databaseConnection: DatabaseConnection;

  public constructor(@inject(DatabaseConnection) databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  public async save(history: History): Promise<Result> {
    try {
      const connection = await this.databaseConnection.getConnection();
      await connection.getRepository<NonFunctionProperties<History>>(HistoryEntity).save(history);

      return new ResultSuccess(undefined);
    } catch (error) {
      console.error("Failed to save history", { error });

      return new ResultError("Failed to save history");
    }
  }

  public async getByUserId(userId: string): Promise<Result<History[]>> {
    try {
      const connection = await this.databaseConnection.getConnection();

      const queryBuilder = connection.manager
        .createQueryBuilder(HistoryEntity, "history")
        .where("history.user_id = :userId", {
          userId,
        })
        .orderBy("history.date", "DESC");

      const foundRawHistorical = await queryBuilder.getMany();

      return new ResultSuccess(foundRawHistorical);
    } catch (error) {
      console.error("Failed to find Historical by user id", { error });

      return new ResultError("Failed to find Historical by user id");
    }
  }
}
