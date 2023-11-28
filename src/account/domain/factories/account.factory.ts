import { AccountType } from "../enums/account_type.enum";
import { IOwnerAccount } from "../interfaces/owner_account.interface";
import { IAccount } from "../interfaces/account.interface";
import { Account } from "../account";
import { OwnerAccountFactory } from "./owner_account.facytory";
import { GenericException } from "../../../shared";
import { AccountStatus } from "../enums/account_status.enum";

export class AccountFactory {
  static createNewAccount(
    accountType: AccountType,
    owner: IOwnerAccount,
  ): IAccount {
    const a: Account = new Account();
    a.setAccountType(accountType).setOwner(owner);
    a.setStatus(AccountStatus.REGISTERED);

    a.build();

    return a;
  }

  static fromPrimitives(id: string, data: any): IAccount {
    const a: Account = new Account();

    try {
      const owner = OwnerAccountFactory.factoryOwnerAccount(
        data.owner,
        data.type,
      );

      a.setId(id)
        .setOwner(owner)
        .setStatus(data.status)
        .setAccountType(data.type)
        .setAccountId(data.accountId)
        .setApplicationId(data.applicationId);

      return a;
    } catch (e) {
      throw new GenericException(e.message);
    }
  }
}
