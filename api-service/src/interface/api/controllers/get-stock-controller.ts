import { inject, injectable } from "inversify";
import { Route, Controller, Tags, Get, Response, Query, Header } from "tsoa";
import { AuthenticateUserCommandHandler } from "../../../application/authenticate-user/authenticate-user-command-handler";
import { GetStockCommand } from "../../../application/get-stock/get-stock-command";
import { GetStockCommandHandler } from "../../../application/get-stock/get-stock-command-handler";
import { RoleEnum } from "../../../domain/enums/Role";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { Stock } from "../../../infrastructure/stock-service/entities/stock";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class GetStockController extends Controller {
  private getStockCommandHandler: GetStockCommandHandler;

  private authenticateUserCommandHandler: AuthenticateUserCommandHandler;

  constructor(
    @inject(GetStockCommandHandler) getStockCommandHandler: GetStockCommandHandler,
    @inject(AuthenticateUserCommandHandler) authenticateUserCommandHandler: AuthenticateUserCommandHandler,
  ) {
    super();
    this.getStockCommandHandler = getStockCommandHandler;
    this.authenticateUserCommandHandler = authenticateUserCommandHandler;
  }

  /**
   * Retrivies an array of stock information.
   */
  @Tags("Stocks")
  @Get("/v1/stock")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async getStock(@Query() stockCode: string, @Header() authorization: string): Promise<Stock[] | ErrorResult> {
    console.log("Starting get stock route", { stockCode });

    const validRolesToThisUseCase = [RoleEnum.USER];

    const authenticationResult = await this.authenticateUserCommandHandler.handle({
      token: authorization,
      validRoles: validRolesToThisUseCase,
    });

    if (authenticationResult.isError) {
      this.setStatus(HttpStatusCode.UNAUTHORIZED);

      return {
        message: authenticationResult.errorMessage,
      };
    }

    const getStockCommand = new GetStockCommand({ stockCode });

    const result = await this.getStockCommandHandler.handle(getStockCommand);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
