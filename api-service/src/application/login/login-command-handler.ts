import { inject, injectable } from "inversify";
import { UserRepository } from "../../infrastructure/database/user/user-repository";
import { CommandHandler } from "../contracts/command-handler";
import { Result } from "../contracts/result/result";
import { ResultSuccess } from "../contracts/result/result-success";
import { CryptographyService } from "../../infrastructure/cryptography-service/cryptography-service";
import { LoginCommand } from "./login-command";
import { SignService } from "../../infrastructure/sign-service/sign-service";
import { ResultError } from "../contracts/result/result-error";

export interface LoginResponse {
  token: string;
}

@injectable()
export class LoginCommandHandler implements CommandHandler<LoginCommand, LoginResponse> {
  private readonly userRepository: UserRepository;
  private readonly signService: SignService;
  private readonly cryptographyService: CryptographyService;

  public constructor(
    @inject(UserRepository) userRepository: UserRepository,
    @inject(SignService) signService: SignService,
    @inject(CryptographyService) cryptographyService: CryptographyService,
  ) {
    this.userRepository = userRepository;
    this.signService = signService;
    this.cryptographyService = cryptographyService;
  }

  public async handle(command: LoginCommand): Promise<Result<LoginResponse>> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser.isError) {
      return existingUser;
    }

    const cryptographyServiceResponse = await this.cryptographyService.verify(
      command.password,
      existingUser.data.password,
    );

    if (cryptographyServiceResponse.isError) {
      return cryptographyServiceResponse;
    }

    if (cryptographyServiceResponse.data === false) {
      return new ResultError("Invalid password");
    }

    const tokenResult = await this.signService.encrypt({
      userId: existingUser.data.id,
    });

    if (tokenResult.isError) {
      return tokenResult;
    }

    return new ResultSuccess({
      token: tokenResult.data,
    });
  }
}
