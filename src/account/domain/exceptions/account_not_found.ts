import { DomainException } from "../../../shared";

export class AccountNotFound extends DomainException {
  name = "account_not_exists";

  constructor(accountId?: string) {
    super();
    if (accountId) {
      this.message = `Account id ${accountId} of the sent account is not registered`;
    } else {
      this.message = "Id de la cuenta enviada no esta registada..";
    }
  }
}
