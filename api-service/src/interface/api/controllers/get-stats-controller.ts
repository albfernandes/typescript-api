import { inject, injectable } from "inversify";
import { Route, Controller, Tags, Get, Response, Header } from "tsoa";
import { AuthenticateUserCommandHandler } from "../../../application/authenticate-user/authenticate-user-command-handler";
import { Stats } from "../../../domain/entities/Stats";
import { RoleEnum } from "../../../domain/enums/Role";
import { StatsRepository } from "../../../infrastructure/database/stats/stats-repository";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class GetStatsController extends Controller {
  private statsRepository: StatsRepository;
  private authenticateUserCommandHandler: AuthenticateUserCommandHandler;

  constructor(
    @inject(StatsRepository) statsRepository: StatsRepository,
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
    const validRolesToThisUseCase = [RoleEnum.ADMIN];

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

    const result = await this.statsRepository.list();

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
