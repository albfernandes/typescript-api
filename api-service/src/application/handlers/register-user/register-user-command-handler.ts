import { inject, injectable } from "inversify";
import { User } from "../../../domain/entities/User";
import { CryptographyService } from "../../../infrastructure/cryptography-service/cryptography-service";
import { UserRepository } from "../../../infrastructure/database/user/user-repository";
import { SignService } from "../../../infrastructure/sign-service/sign-service";
import { CommandHandler } from "../../contracts/command-handler";
import { Result } from "../../contracts/result/result";
import { ResultError } from "../../contracts/result/result-error";
import { ResultStatusEnum } from "../../contracts/result/result-status-enum";
import { ResultSuccess } from "../../contracts/result/result-success";
import { RegisterUserCommand } from "./register-user-command";

export interface RegisterUserResponse {
  token: string;
  email: string;
  password: string;
}

@injectable()
export class RegisterUserCommandHandler implements CommandHandler<RegisterUserCommand, RegisterUserResponse> {
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
      password: command.password,
    });
  }
}
