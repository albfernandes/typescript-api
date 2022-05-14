import { inject, injectable } from "inversify";
import { Route, Controller, Tags, Response, Post, Body } from "tsoa";
import { RegisterUserCommand } from "../../../application/register-user/register-user-command";
import {
  RegisterUserCommandHandler,
  RegisterUserResponse,
} from "../../../application/register-user/register-user-command-handler";
import { RoleEnum } from "../../../domain/enums/Role";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class RegisterController extends Controller {
  private registerUserCommandHandler: RegisterUserCommandHandler;

  constructor(@inject(RegisterUserCommandHandler) registerUserCommandHandler: RegisterUserCommandHandler) {
    super();
    this.registerUserCommandHandler = registerUserCommandHandler;
  }

  /**
   * Register an user.
   */
  @Tags("Register")
  @Post("/v1/register")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async register(
    @Body() body: { email: string; role: RoleEnum; password: string },
  ): Promise<RegisterUserResponse | ErrorResult> {
    const registerUserCommand = new RegisterUserCommand({ ...body });

    const result = await this.registerUserCommandHandler.handle(registerUserCommand);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
