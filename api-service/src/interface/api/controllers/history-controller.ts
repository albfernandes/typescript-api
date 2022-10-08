import { inject, injectable } from "inversify";
import { Controller, Get, Header, Response, Route, Tags } from "tsoa";
import { IHistoryRepository } from "../../../application/contracts/ihistory-repository";
import { AuthenticateUserCommandHandler } from "../../../application/handlers/authenticate-user/authenticate-user-command-handler";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { Stock } from "../../../infrastructure/stock-service/entities/stock";
import * as Types from ".././../../infrastructure/configurations/types";
import { API_SCOPE } from "../configurations/api-scope";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class HistoryController extends Controller {
  private historyRepository: IHistoryRepository;
  private authenticateUserCommandHandler: AuthenticateUserCommandHandler;

  constructor(
    @inject(Types.IHistoryRepository) historyRepository: IHistoryRepository,
    @inject(AuthenticateUserCommandHandler) authenticateUserCommandHandler: AuthenticateUserCommandHandler,
  ) {
    super();
    this.historyRepository = historyRepository;
    this.authenticateUserCommandHandler = authenticateUserCommandHandler;
  }

  /**
   * Retrivies an array of queries history.
   */
  @Tags("History")
  @Get("/v1/history")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async getHistorical(@Header() authorization: string): Promise<Stock[] | ErrorResult> {
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

    const result = await this.historyRepository.getByUserId(authenticationResult.data.id);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
