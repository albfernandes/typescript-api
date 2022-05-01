import { inject, injectable } from "inversify";
import axios, { AxiosInstance } from "axios";
import { Settings } from "../configurations/settings";
import { ResultSuccess } from "../../application/contracts/result/result/result-success";
import { ResultError } from "../../application/contracts/result/result/result-error";
import { Result } from "../../application/contracts/result/result/result";
import { Parser } from "csv-parse";
import { Stock } from "../../domain/entities/stock";
import { validateSync } from "class-validator";
import { StockResponseMapping } from "./enums/stock-response-mapping";

@injectable()
export class StockService {
  private readonly settings: Settings;
  private readonly client: AxiosInstance;

  public constructor(@inject(Settings) settings: Settings) {
    this.settings = settings;

    this.client = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
      baseURL: this.settings.stockServiceUrl,
      responseType: "stream",
    });
  }

  public async getStock(stockCode: string): Promise<Result<Stock[]>> {
    try {
      const PATH = "/q/l";
      const params = { s: stockCode, f: "sd2t2ohlcvn", h: "true", e: "csv" };

      console.log("Getting stock", { params });

      const result = await this.client.get(PATH, { params });

      const parser = result.data.pipe(
        new Parser({
          delimiter: ",",
          relax_column_count: true,
          skip_empty_lines: true,
          columns: true,
        }),
      );

      const stocks: Stock[] = [];

      for await (const csvRow of parser) {
        const stock = new Stock({
          symbol: csvRow[StockResponseMapping.SYMBOL],
          open: Number(csvRow[StockResponseMapping.OPEN]),
          high: Number(csvRow[StockResponseMapping.HIGH]),
          low: Number(csvRow[StockResponseMapping.LOW]),
          close: Number(csvRow[StockResponseMapping.CLOSE]),
          name: csvRow[StockResponseMapping.NAME],
        });

        const errors = validateSync(stock);

        if (errors.length !== 0) {
          console.error("Received an invalid stock", {
            csvRow,
            validationErrors: errors,
          });

          return new ResultError("Received an invalid stock");
        }

        stocks.push(stock);
      }

      console.log("Stock Result", { stocks });

      return new ResultSuccess(stocks);
    } catch (error) {
      console.error("Failed to get stock", { error });
      return new ResultError("Failed to get stock");
    }
  }
}
