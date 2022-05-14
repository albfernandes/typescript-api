import { inject, injectable } from "inversify";
import { Settings } from "../configurations/settings";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";

@injectable()
export class SignService {
  private readonly settings: Settings;

  public constructor(@inject(Settings) settings: Settings) {
    this.settings = settings;
  }

  public async encrypt(payload: string | Object | Buffer): Promise<Result<string>> {
    try {
      const token = await sign(payload, this.settings.tokenSecret);

      return new ResultSuccess(token);
    } catch (error) {
      return new ResultError("Failed to encrypt");
    }
  }

  public async decrypt(encodedToken: string): Promise<Result<string | JwtPayload>> {
    try {
      const decodedToken = await verify(encodedToken, this.settings.tokenSecret);

      return new ResultSuccess(decodedToken);
    } catch (error) {
      return new ResultError("Failed to decrypt");
    }
  }
}
