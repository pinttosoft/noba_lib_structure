import { AccountType } from "../enums/account_type.enum";
import { IOwnerAccount } from "../interfaces/owner_account.interface";
import { CompanyOwner } from "@/account/domain/company_owner";
import { IndividualOwner } from "@/account/domain/individual_owner";

export class OwnerAccountFactory {
  static factoryOwnerAccount(data: any, type: AccountType): IOwnerAccount {
    if (type === AccountType.INDIVIDUAL) {
      return new IndividualOwner(data);
    }

    return new CompanyOwner(data);
  }
}
