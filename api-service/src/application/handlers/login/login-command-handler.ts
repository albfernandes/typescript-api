import { inject, injectable } from "inversify";
import { CryptographyService } from "../../../infrastructure/cryptography-service/cryptography-service";
import { SignService } from "../../../infrastructure/sign-service/sign-service";
import { CommandHandler } from "../../contracts/command-handler";
import { IUserRepository } from "../../contracts/iuser-repository";
import { Result } from "../../contracts/result/result";
import { ResultError } from "../../contracts/result/result-error";
import { ResultSuccess } from "../../contracts/result/result-success";
import { LoginCommand } from "./login-command";
import * as Types from ".././../../infrastructure/configurations/types";

export interface LoginResponse {
  token: string;
}

@injectable()
export class LoginCommandHandler implements CommandHandler<LoginCommand, LoginResponse> {
  private readonly userRepository: IUserRepository;
  private readonly signService: SignService;
  private readonly cryptographyService: CryptographyService;

  public constructor(
    @inject(Types.IUserRepository) userRepository: IUserRepository,
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
