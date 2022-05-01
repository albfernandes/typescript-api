import { NonFunctionProperties } from "../../application/contracts/types";

export class History {
  public name!: string;

  public symbol!: string;

  public open!: number;

  public high!: number;

  public low!: number;

  public close!: number;

  public date!: Date;

  public userId!: string;

  public id!: string;

  public constructor(data: NonFunctionProperties<History>) {
    this.name = data.name;
    this.symbol = data.symbol;
    this.open = data.open;
    this.high = data.high;
    this.low = data.low;
    this.close = data.close;
    this.date = data.date;
    this.userId = data.userId;
    this.id = data.id;
  }
}
