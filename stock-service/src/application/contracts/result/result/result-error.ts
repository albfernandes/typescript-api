import { ResultStatusEnum } from "./result-status-enum";

export class ResultError {
  public readonly errorMessage: string;

  public readonly isError: true = true;

  public readonly status: ResultStatusEnum.ERROR = ResultStatusEnum.ERROR;

  public constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
}
