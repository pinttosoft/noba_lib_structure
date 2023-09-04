import { DomainException } from "../../../shared";

export class UserNotFound extends DomainException {
  name = "user_not_exists";

  constructor(email: string) {
    super();
    this.message = `Usuario con email ${email} no fue encontrado en el sistema.`;
  }
}
