import { NonFunctionProperties } from "../contracts/types";

export class GetStockCommand {
  public stockCode: string;

  public constructor(data: NonFunctionProperties<GetStockCommand>) {
    this.stockCode = data.stockCode;
  }
}
