import { AccountType } from "../enums/account_type";
import { IOwnerAccount } from "../interfaces/owner_account.interface";
import { IndividualOwner } from "../individual_owner";
import { CompanyOwner } from "@/account/domain/company_owner";

export class OwnerAccount {
  static factoryOwnerAccount(data: any, type: AccountType): IOwnerAccount {
    if (type === AccountType.INDIVIDUAL) {
      return new IndividualOwner(data);
    }

    return new CompanyOwner(data);
  }
}
