import { NonFunctionProperties } from "../contracts/types";

export class GetStockCommand {
  public stockCode: string;
  public userId: string;

  public constructor(data: NonFunctionProperties<GetStockCommand>) {
    this.stockCode = data.stockCode;
    this.userId = data.userId;
  }
}
