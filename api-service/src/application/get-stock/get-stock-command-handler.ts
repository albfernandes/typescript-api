import { inject, injectable } from "inversify";
import { History } from "../../domain/entities/History";
import { Stats } from "../../domain/entities/Stats";
import { HistoryRepository } from "../../infrastructure/database/history/history-repository";
import { StatsRepository } from "../../infrastructure/database/stats/stats-repository";
import { Stock } from "../../infrastructure/stock-service/entities/stock";
import { StockService } from "../../infrastructure/stock-service/stock-service";
import { CommandHandler } from "../contracts/command-handler";
import { Result } from "../contracts/result/result";
import { ResultStatusEnum } from "../contracts/result/result-status-enum";
import { GetStockCommand } from "./get-stock-command";

@injectable()
export class GetStockCommandHandler implements CommandHandler<GetStockCommand, Stock[]> {
  private readonly stockService: StockService;

  private readonly historyRepository: HistoryRepository;

  private readonly statsRepository: StatsRepository;

  public constructor(
    @inject(StockService) stockService: StockService,
    @inject(HistoryRepository) historyRepository: HistoryRepository,
    @inject(StatsRepository) statsRepository: StatsRepository,
  ) {
    this.stockService = stockService;
    this.historyRepository = historyRepository;
    this.statsRepository = statsRepository;
  }

  public async handle(command: GetStockCommand): Promise<Result<Stock[]>> {
    console.log("Getting stock information", { command });

    const foundStockInformation = await this.stockService.getStock(command.stockCode);

    if (foundStockInformation.isError) {
      return foundStockInformation;
    }

    const [firstStock] = foundStockInformation.data;
    console.log("Got stock information with success", { command, foundStockInformation });

    const savedHistory = await this.historyRepository.save(
      History.create({
        name: firstStock.name,
        close: firstStock.close,
        high: firstStock.high,
        low: firstStock.low,
        open: firstStock.open,
        symbol: firstStock.symbol,
        userId: command.userId,
      }),
    );

    if (savedHistory.isError) {
      return savedHistory;
    }

    const foundStats = await this.statsRepository.findByStock(firstStock.symbol);

    if (foundStats.status === ResultStatusEnum.ERROR) {
      return foundStats;
    }

    let stats;

    if (foundStats.status === ResultStatusEnum.SUCCESS) {
      foundStats.data.incrementCounter();
      stats = foundStats.data;
    } else {
      stats = Stats.create({ stock: firstStock.symbol });
    }

    const savedStats = await this.statsRepository.save(stats);

    if (savedStats.isError) {
      return savedStats;
    }

    return foundStockInformation;
  }
}
