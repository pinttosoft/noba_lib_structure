import { encrypt } from "../../../shared/helpers/hash";

export class PasswordValueObject {
  constructor(private readonly passwordPlain: string) {}

  static instance(passwordPlain: string) {
    return new PasswordValueObject(passwordPlain);
  }
  async getValue(): Promise<string> {
    return await encrypt(this.passwordPlain);
  }
}
