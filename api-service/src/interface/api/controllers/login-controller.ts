import { inject, injectable } from "inversify";
import { Route, Controller, Tags, Response, Post, Body } from "tsoa";
import { LoginCommand } from "../../../application/handlers/login/login-command";
import { LoginCommandHandler, LoginResponse } from "../../../application/handlers/login/login-command-handler";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class LoginController extends Controller {
  private loginCommandHandler: LoginCommandHandler;

  constructor(@inject(LoginCommandHandler) loginCommandHandler: LoginCommandHandler) {
    super();
    this.loginCommandHandler = loginCommandHandler;
  }

  /**
   * Logins and retrieves an authorization token.
   */
  @Tags("Login")
  @Post("/v1/login")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async login(@Body() body: { email: string; password: string }): Promise<LoginResponse | ErrorResult> {
    const registerUserCommand = new LoginCommand({ ...body });

    const result = await this.loginCommandHandler.handle(registerUserCommand);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
