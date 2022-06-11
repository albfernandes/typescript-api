import { inject, injectable } from "inversify";
import { Route, Controller, Tags, Get, Response, Query, Header } from "tsoa";
import { AuthenticateUserCommandHandler } from "../../../application/handlers/authenticate-user/authenticate-user-command-handler";
import { GetStockCommand } from "../../../application/handlers/get-stock/get-stock-command";
import { GetStockCommandHandler } from "../../../application/handlers/get-stock/get-stock-command-handler";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { Stock } from "../../../infrastructure/stock-service/entities/stock";
import { API_SCOPE } from "../configurations/api-scope";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class StockController extends Controller {
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
    const validRolesToThisUseCase = API_SCOPE.user;

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

    const getStockCommand = new GetStockCommand({ stockCode, userId: authenticationResult.data.id });

    const result = await this.getStockCommandHandler.handle(getStockCommand);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
