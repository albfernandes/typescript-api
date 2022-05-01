import { NonFunctionProperties } from "../../application/contracts/types";

export class Stats {
  public readonly stock: string;
  public readonly timesRequested: string;

  public constructor(data: NonFunctionProperties<Stats>) {
    this.stock = data.stock;
    this.timesRequested = data.timesRequested;
  }
}
