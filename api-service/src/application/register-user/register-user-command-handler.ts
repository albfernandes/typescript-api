import { inject, injectable } from "inversify";
import { User } from "../../domain/entities/User";
import { CryptographyService } from "../../infrastructure/cryptography/cryptography-service";
import { UserRepository } from "../../infrastructure/database/user/user-repository";
import { CommandHandler } from "../contracts/command-handler";
import { Result } from "../contracts/result/result";
import { ResultError } from "../contracts/result/result-error";
import { ResultStatusEnum } from "../contracts/result/result-status-enum";
import { ResultSuccess } from "../contracts/result/result-success";
import { RegisterUserCommand } from "./register-user-command";

export interface RegisterUserResponse {
  token: string;
  email: string;
}

@injectable()
export class RegisterUserCommandHandler implements CommandHandler<RegisterUserCommand, RegisterUserResponse> {
  private readonly userRepository: UserRepository;
  private readonly cryptographyservice: CryptographyService;

  public constructor(
    @inject(UserRepository) userRepository: UserRepository,
    @inject(CryptographyService) cryptographyservice: CryptographyService,
  ) {
    this.userRepository = userRepository;
    this.cryptographyservice = cryptographyservice;
  }

  public async handle(command: RegisterUserCommand): Promise<Result<RegisterUserResponse>> {
    const userAlreadyExist = await this.userRepository.findByEmail(command.email);

    if (userAlreadyExist.status === ResultStatusEnum.SUCCESS) {
      return new ResultError("This email is already in use");
    }

    if (userAlreadyExist.status === ResultStatusEnum.ERROR) {
      return userAlreadyExist;
    }

    const newUser = User.create({
      email: command.email,
      role: command.role,
    });

    const saveResult = await this.userRepository.save(newUser);

    if (saveResult.isError) {
      return saveResult;
    }

    const tokenResult = await this.cryptographyservice.encrypt({
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
