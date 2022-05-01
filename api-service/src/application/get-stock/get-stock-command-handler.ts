import { inject, injectable } from "inversify";
import { Stock } from "../../infrastructure/stock-service/entities/stock";
import { StockService } from "../../infrastructure/stock-service/stock-service";
import { CommandHandler } from "../contracts/command-handler";
import { Result } from "../contracts/result/result/result";
import { GetStockCommand } from "./get-stock-command";

@injectable()
export class GetStockCommandHandler implements CommandHandler<GetStockCommand, Stock[]> {
  private readonly stockService: StockService;

  public constructor(@inject(StockService) stockService: StockService) {
    this.stockService = stockService;
  }

  public async handle(command: GetStockCommand): Promise<Result<Stock[]>> {
    console.log("Getting stock information", { command });

    const foundStockInformation = await this.stockService.getStock(command.stockCode);

    if (foundStockInformation.isError) {
      return foundStockInformation;
    }

    console.log("Got stock information with success", { command, foundStockInformation });

    return foundStockInformation;
  }
}
