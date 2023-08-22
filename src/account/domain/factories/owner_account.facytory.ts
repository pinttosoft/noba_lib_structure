import { AccountType } from "../enums/account_type";
import { IOwnerAccount } from "../interfaces/owner_account.interface";
import { IndividualOwner } from "../individual_owner";

export class OwnerAccount implements IOwnerAccount {
  private individualOwner: OwnerAccount;

  static factoryOwnerAccount(data: any, type: AccountType): IOwnerAccount {
    if (type === AccountType.INDIVIDUAL) {
      return new IndividualOwner(data);
    }

    return new OwnerAccount();
  }

  getName(): string {
    return "";
  }

  toJson(): any {}
}
