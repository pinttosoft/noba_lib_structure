import { DomainException } from "@/shared/domain/exceptions/domain_exception";

export class AccountHashNoPartners extends DomainException {
  name = "account_has_no_partners";

  constructor(accountId?: string) {
    super();
    if (accountId) {
      this.message = `Account id ${accountId} has no partners`;
    } else {
      this.message = "the account has no partners.";
    }
  }
}
