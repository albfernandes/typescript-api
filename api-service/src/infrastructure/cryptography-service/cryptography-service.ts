import { inject, injectable } from "inversify";
import { Settings } from "../configurations/settings";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";
import bcrypt from "bcrypt";

@injectable()
export class CryptographyService {
  private readonly settings: Settings;

  public constructor(@inject(Settings) settings: Settings) {
    this.settings = settings;
  }

  public async encrypt(payload: string): Promise<Result<string>> {
    try {
      const hash = await bcrypt.hash(payload, this.settings.encryptSaltRounds);

      return new ResultSuccess(hash);
    } catch (error) {
      return new ResultError("Failed to encrypt");
    }
  }

  public async verify(plainTextPassword: string, hash: string): Promise<Result<boolean>> {
    try {
      const hashEqualsPlainTextPassword = await bcrypt.compare(plainTextPassword, hash);

      return new ResultSuccess(hashEqualsPlainTextPassword);
    } catch (error) {
      return new ResultError("Failed to verify");
    }
  }
}
