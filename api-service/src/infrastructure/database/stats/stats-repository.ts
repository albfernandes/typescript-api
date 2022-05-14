import { injectable, inject } from "inversify";
import { Result } from "../../../application/contracts/result/result";
import { ResultError } from "../../../application/contracts/result/result-error";
import { ResultNotFound } from "../../../application/contracts/result/result-not-found";
import { ResultSuccess } from "../../../application/contracts/result/result-success";
import { NonFunctionProperties } from "../../../application/contracts/types";
import { Stats } from "../../../domain/entities/Stats";
import { DatabaseConnection } from "../database-connection";
import { StatsEntity } from "./stats-schema";

@injectable()
export class StatsRepository {
  private readonly databaseConnection: DatabaseConnection;

  public constructor(@inject(DatabaseConnection) databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  public async save(stats: Stats): Promise<Result> {
    try {
      const connection = await this.databaseConnection.getConnection();
      await connection.getRepository<NonFunctionProperties<Stats>>(StatsEntity).save(stats);

      return new ResultSuccess(undefined);
    } catch (error) {
      console.error("Failed to save stats", { error });

      return new ResultError("Failed to save stats");
    }
  }

  public async findByStock(stock: string): Promise<Result<Stats>> {
    try {
      const connection = await this.databaseConnection.getConnection();

      const queryBuilder = connection.manager.createQueryBuilder(StatsEntity, "stats").where("stats.stock = :stock", {
        stock,
      });

      const foundRawStats = await queryBuilder.getOne();

      if (foundRawStats === undefined) {
        return new ResultNotFound("stats not found by stock");
      }

      return new ResultSuccess(new Stats({ ...foundRawStats }));
    } catch (error) {
      console.error("Failed to find stats by stock", { error });

      return new ResultError("Failed to find stats by stock");
    }
  }

  public async list(limit = 5): Promise<Result<Stats[]>> {
    try {
      const connection = await this.databaseConnection.getConnection();

      const queryBuilder = connection.manager
        .createQueryBuilder(StatsEntity, "stats")
        .orderBy("stats.times_requested", "DESC")
        .limit(limit);

      const rawHistorical = await queryBuilder.getMany();

      return new ResultSuccess(rawHistorical);
    } catch (error) {
      console.error("Failed to list stats", { error });

      return new ResultError("Failed to list stats");
    }
  }
}
