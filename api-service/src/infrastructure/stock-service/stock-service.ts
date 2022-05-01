import { inject, injectable } from "inversify";
import axios, { AxiosInstance } from "axios";
import { Settings } from "../configurations/settings";
import { ResultSuccess } from "../../application/contracts/result/result/result-success";
import { ResultError } from "../../application/contracts/result/result/result-error";
import { Result } from "../../application/contracts/result/result/result";
import { Stock } from "./entities/stock";

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

      console.log("Getting stock", { stockCode });

      const result = await this.client.get(PATH, { params });

      const stocks: Stock[] = [...result.data];

      console.log("Stock Result", { stocks });

      return new ResultSuccess(stocks);
    } catch (error) {
      console.error("Failed to get stock", { error });
      return new ResultError("Failed to get stock");
    }
  }
}
