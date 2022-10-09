import { inject, injectable } from "inversify";
import { Arg, Query, Resolver } from "type-graphql";
import { IHistoryRepository } from "../../../../application/contracts/ihistory-repository";
import { History } from "../../../../domain/entities/History";
import * as Types from "../../../../infrastructure/configurations/types";
import { HistoryType } from "../schemas/history-type";

@Resolver(HistoryType)
@injectable()
export class HistoryResolver {
  private historyRepository: IHistoryRepository;

  constructor(@inject(Types.IHistoryRepository) historyRepository: IHistoryRepository) {
    this.historyRepository = historyRepository;
  }

  @Query(() => [HistoryType], { name: "listHistoryByUserId" })
  public async list(@Arg("userId") userId: string): Promise<History[]> {
    const result = await this.historyRepository.getByUserId(userId);

    if (result.isError) {
      return [];
    }

    return result.data;
  }
}
