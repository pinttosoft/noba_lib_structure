import { AccountType } from "@/account/domain/enums/account_type.enum";
import { IAccount } from "@/account/domain/interfaces/account.interface";
import { Account } from "@/account/domain/account";
import { IOwnerAccount } from "@/account/domain/interfaces/owner_account.interface";
import { GenericException } from "@/shared/domain/exceptions/generic_exception";
import { OwnerAccountFactory } from "@/account/domain/factories/owner_account.facytory";

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
