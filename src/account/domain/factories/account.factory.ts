import { AccountType } from "../enums/account_type.enum";
import { IOwnerAccount } from "../interfaces/owner_account.interface";
import { IAccount } from "../interfaces/account.interface";
import { Account } from "../account";
import { OwnerAccountFactory } from "./owner_account.facytory";
import { GenericException } from "../../../shared";

export class AccountFactory {
  static createNewAccount(
    accountType: AccountType,
    owner: IOwnerAccount,
    companyPartners?: IOwnerAccount[],
  ): IAccount {
    const a: Account = new Account();
    a.setAccountType(accountType).setOwner(owner);

    if (accountType === AccountType.COMPANY) {
      a.setCompanyPartners(companyPartners);
    }

    a.build();

    return a;
  }

  static fromPrimitives(id: string, data: any): IAccount {
    const a: Account = new Account();

    try {
      const companyPartners: IOwnerAccount[] = data.companyPartners.map(
        (p: any) => OwnerAccountFactory.factoryOwnerAccount(p, data.type),
      );

      a.setId(id)
        .setAccountType(data.type)
        .setCompanyPartners(companyPartners)
        .setAccountId(data.accountId);

      return a;
    } catch (e) {
      throw new GenericException(e.message);
    }
  }
}
