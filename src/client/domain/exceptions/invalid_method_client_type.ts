import { DomainException } from "../../../shared";
import { AccountType } from "../../../account";

export class InvalidMethodForClientType extends DomainException {
  name = "invalid_method_client_type";

  constructor(clientType: AccountType) {
    super();
    this.message = `Valid method for customer type ${clientType}`;
  }
}
