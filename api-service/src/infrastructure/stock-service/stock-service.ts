import { inject, injectable } from "inversify";
import axios, { AxiosInstance } from "axios";
import { Settings } from "../configurations/settings";
import { Stock } from "./entities/stock";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";

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
    });
  }

  public async getStock(stockCode: string): Promise<Result<Stock[]>> {
    try {
      const PATH = "/stock-service/api/v1/stock";
      const params = { stockCode };

      const result = await this.client.get(PATH, { params });

      const stocks: Stock[] = [...result.data];

      return new ResultSuccess(stocks);
    } catch (error) {
      return new ResultError("Failed to get stock");
    }
  }
}
