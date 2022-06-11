import { Stats } from "../../domain/entities/Stats";
import { Result } from "./result/result";

export interface IStatsRepository {
  save(stats: Stats): Promise<Result>;
  findByStock(stock: string): Promise<Result<Stats>>;
  list(limit: number): Promise<Result<Stats[]>>;
}
