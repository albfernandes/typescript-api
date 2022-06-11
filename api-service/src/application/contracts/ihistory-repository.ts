import { History } from "../../domain/entities/History";
import { Result } from "./result/result";

export interface IHistoryRepository {
  save(history: History): Promise<Result>;
  getByUserId(userId: string): Promise<Result<History[]>>;
}
