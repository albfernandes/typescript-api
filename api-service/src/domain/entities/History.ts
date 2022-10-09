import { NonFunctionProperties } from "../../application/contracts/types";
import { v4 as uuid } from "uuid";

type CreateHistoryParams = Omit<NonFunctionProperties<History>, "date" | "id">;

export interface IHistory {
  name: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  date: Date;
  userId: string;
  id: string;
}

export class History implements IHistory {
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

  public static create(data: CreateHistoryParams): History {
    return new History({
      name: data.name,
      symbol: data.symbol,
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
      date: new Date(),
      userId: data.userId,
      id: uuid(),
    });
  }
}
