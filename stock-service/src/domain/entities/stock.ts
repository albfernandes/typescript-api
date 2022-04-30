import { IsDefined, IsString } from "class-validator";
import { NonFunctionProperties } from "../../application/contracts/types";

export class Stock {
  @IsDefined()
  @IsString()
  public name!: string;

  @IsDefined()
  @IsString()
  public symbol!: string;

  @IsDefined()
  @IsString()
  public open!: number;

  @IsDefined()
  @IsString()
  public high!: number;

  @IsDefined()
  @IsString()
  public low!: number;

  @IsDefined()
  @IsString()
  public close!: number;

  public constructor(data: NonFunctionProperties<Stock>) {
    this.name = data.name;
    this.symbol = data.symbol;
    this.open = data.open;
    this.high = data.high;
    this.low = data.low;
    this.close = data.close;
  }
}
