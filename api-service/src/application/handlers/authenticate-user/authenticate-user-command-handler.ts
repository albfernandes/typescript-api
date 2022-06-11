import { inject, injectable } from "inversify";
import { AuthenticateUserCommand } from "./authenticate-user-command";
import { ResultError } from "../../contracts/result/result-error";
import { CommandHandler } from "../../contracts/command-handler";
import { User } from "../../../domain/entities/User";
import { SignService } from "../../../infrastructure/sign-service/sign-service";
import { Result } from "../../contracts/result/result";
import { IUserRepository } from "../../contracts/iuser-repository";
import * as Types from ".././../../infrastructure/configurations/types";

@injectable()
export class AuthenticateUserCommandHandler implements CommandHandler<AuthenticateUserCommand, User> {
  private readonly userRepository: IUserRepository;
  private readonly signService: SignService;

  public constructor(
    @inject(Types.IUserRepository) userRepository: IUserRepository,
    @inject(SignService) signService: SignService,
  ) {
    this.userRepository = userRepository;
    this.signService = signService;
  }

  public async handle(command: AuthenticateUserCommand): Promise<Result<User>> {
    if (!/Bearer\s/.test(command.token)) {
      return new ResultError("token with invalid format");
    }

    const [, token]: string[] = command.token.split(" ");

    const decodedToken = await this.signService.decrypt(token);

    if (decodedToken.isError) {
      return decodedToken;
    }

    const { userId } = decodedToken.data as {
      userId: string;
    };

    const foundUser = await this.userRepository.findById(userId);

    if (foundUser.isError) {
      return foundUser;
    }

    if (!command.validRoles.includes(foundUser.data.role)) {
      return new ResultError("invalid role for this use case");
    }

    return foundUser;
  }
}
