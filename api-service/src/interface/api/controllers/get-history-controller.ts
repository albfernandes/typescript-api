import { inject, injectable } from "inversify";
import { Route, Controller, Tags, Get, Response, Header } from "tsoa";
import { AuthenticateUserCommandHandler } from "../../../application/authenticate-user/authenticate-user-command-handler";
import { RoleEnum } from "../../../domain/enums/Role";
import { HistoryRepository } from "../../../infrastructure/database/history/history-repository";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { Stock } from "../../../infrastructure/stock-service/entities/stock";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class GetHistoryController extends Controller {
  private historyRepository: HistoryRepository;
  private authenticateUserCommandHandler: AuthenticateUserCommandHandler;

  constructor(
    @inject(HistoryRepository) historyRepository: HistoryRepository,
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
    console.log("Starting get queries history route");

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

    const result = await this.historyRepository.getByUserId(authenticationResult.data.id);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
