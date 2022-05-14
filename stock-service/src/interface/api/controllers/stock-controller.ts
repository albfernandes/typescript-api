import { inject, injectable } from "inversify";
import { Route, Controller, Tags, Get, Response, Query } from "tsoa";
import { GetStockCommand } from "../../../application/get-stock/get-stock-command";
import { GetStockCommandHandler } from "../../../application/get-stock/get-stock-command-handler";
import { Stock } from "../../../domain/entities/stock";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class StockController extends Controller {
  private getStockCommandHandler: GetStockCommandHandler;

  constructor(@inject(GetStockCommandHandler) getStockCommandHandler: GetStockCommandHandler) {
    super();
    this.getStockCommandHandler = getStockCommandHandler;
  }

  /**
   * Retrivies an array of stock information.
   */
  @Tags("Stocks")
  @Get("/v1/stock")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async getStock(@Query() stockCode: string): Promise<Stock[] | ErrorResult> {
    const getStockCommand = new GetStockCommand({ stockCode });

    const result = await this.getStockCommandHandler.handle(getStockCommand);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
