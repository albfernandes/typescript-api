import { inject, injectable } from "inversify";
import { User } from "../../../domain/entities/User";
import { CryptographyService } from "../../../infrastructure/cryptography-service/cryptography-service";
import { SignService } from "../../../infrastructure/sign-service/sign-service";
import { CommandHandler } from "../../contracts/command-handler";
import { IUserRepository } from "../../contracts/iuser-repository";
import { Result } from "../../contracts/result/result";
import { ResultError } from "../../contracts/result/result-error";
import { ResultStatusEnum } from "../../contracts/result/result-status-enum";
import { ResultSuccess } from "../../contracts/result/result-success";
import * as Types from ".././../../infrastructure/configurations/types";
import { RegisterUserCommand } from "./register-user-command";

export interface RegisterUserResponse {
  token: string;
  email: string;
}

@injectable()
export class RegisterUserCommandHandler implements CommandHandler<RegisterUserCommand, RegisterUserResponse> {
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

  public async handle(command: RegisterUserCommand): Promise<Result<RegisterUserResponse>> {
    const userAlreadyExist = await this.userRepository.findByEmail(command.email);

    if (userAlreadyExist.status === ResultStatusEnum.SUCCESS) {
      return new ResultError("This email is already in use");
    }

    if (userAlreadyExist.status === ResultStatusEnum.ERROR) {
      return userAlreadyExist;
    }

    const cryptographyServiceResponse = await this.cryptographyService.encrypt(command.password);

    if (cryptographyServiceResponse.isError) {
      return cryptographyServiceResponse;
    }

    const newUser = User.create({
      email: command.email,
      role: command.role,
      password: cryptographyServiceResponse.data,
    });

    if (cryptographyServiceResponse.isError) {
      return cryptographyServiceResponse;
    }

    const saveResult = await this.userRepository.save(newUser);

    if (saveResult.isError) {
      return saveResult;
    }

    const tokenResult = await this.signService.encrypt({
      userId: newUser.id,
    });

    if (tokenResult.isError) {
      return tokenResult;
    }

    return new ResultSuccess({
      token: tokenResult.data,
      email: command.email,
    });
  }
}
