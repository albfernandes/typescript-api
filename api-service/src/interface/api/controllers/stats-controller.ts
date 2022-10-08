import { inject, injectable } from "inversify";
import { Controller, Get, Header, Response, Route, Tags } from "tsoa";
import { IStatsRepository } from "../../../application/contracts/istats-repository";
import { AuthenticateUserCommandHandler } from "../../../application/handlers/authenticate-user/authenticate-user-command-handler";
import { Stats } from "../../../domain/entities/Stats";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import * as Types from ".././../../infrastructure/configurations/types";
import { API_SCOPE } from "../configurations/api-scope";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class StatsController extends Controller {
  private statsRepository: IStatsRepository;
  private authenticateUserCommandHandler: AuthenticateUserCommandHandler;

  constructor(
    @inject(Types.IStatsRepository) statsRepository: IStatsRepository,
    @inject(AuthenticateUserCommandHandler) authenticateUserCommandHandler: AuthenticateUserCommandHandler,
  ) {
    super();
    this.statsRepository = statsRepository;
    this.authenticateUserCommandHandler = authenticateUserCommandHandler;
  }

  /**
   * Retrivies an array of the most searched stocks.
   */
  @Tags("Stats")
  @Get("/v1/stats")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async getStats(@Header() authorization: string): Promise<Stats[] | ErrorResult> {
    const validRolesToThisUseCase = API_SCOPE.admin;

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

    const result = await this.statsRepository.list(5);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
