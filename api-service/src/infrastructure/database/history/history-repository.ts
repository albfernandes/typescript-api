import { injectable, inject } from "inversify";
import { Result } from "../../../application/contracts/result/result/result";
import { ResultError } from "../../../application/contracts/result/result/result-error";
import { ResultSuccess } from "../../../application/contracts/result/result/result-success";
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
}
