import { AccountType } from "../enums/account_type";
import { IOwnerAccount } from "../interfaces/owner_account.interface";
import { CompanyOwner } from "@/account/domain/company_owner";
import { IndividualOwner } from "@/account";
import { IWallet } from "@/wallet";
import { GenericException } from "@/shared/domain/exceptions/generic_exception";
import { Wallet } from "@/wallet/domain/wallet";

export class OwnerAccount {
  static factoryOwnerAccount(data: any, type: AccountType): IOwnerAccount {
    if (type === AccountType.INDIVIDUAL) {
      return new IndividualOwner(data);
    }

    return new CompanyOwner(data);
  }
}
