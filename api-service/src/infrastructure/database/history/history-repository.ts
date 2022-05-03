import { injectable, inject } from "inversify";
import { Result } from "../../../application/contracts/result/result";
import { ResultError } from "../../../application/contracts/result/result-error";
import { ResultSuccess } from "../../../application/contracts/result/result-success";
import { NonFunctionProperties } from "../../../application/contracts/types";
import { History } from "../../../domain/entities/History";
import { DatabaseConnection } from "../database-connection";
import { HistoryEntity } from "./history-schema";

@injectable()
export class HistoryRepository {
  private readonly databaseConnection: DatabaseConnection;

  public constructor(@inject(DatabaseConnection) databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  public async save(history: History): Promise<Result> {
    console.log("Saving history", { history });

    try {
      const connection = await this.databaseConnection.getConnection();
      const result = await connection.getRepository<NonFunctionProperties<History>>(HistoryEntity).save(history);

      console.log("Saved history", { result });

      return new ResultSuccess(undefined);
    } catch (error) {
      console.error("Failed to save history", { error });

      return new ResultError("Failed to save history");
    }
  }

  public async getByUserId(userId: string): Promise<Result<History[]>> {
    console.log("Finding historical by user id", { userId });

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
