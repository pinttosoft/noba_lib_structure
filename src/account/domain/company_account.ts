import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { Account } from "./abstracts/account.abstract";
import { IAccount } from "./interfaces/account.interface";
import { OwnerAccount } from "./factories/owner_account.facytory";
import { AccountType } from "./enums/account_type";
import { Company } from "@/client/domain/types/company";

export class CompanyAccount extends Account implements IAccount {
  constructor(private readonly company: Company) {
    super();
    this.createOwnerAccount();
  }

  private createOwnerAccount(): void {
    this.owner = OwnerAccount.factoryOwnerAccount(
      this.company,
      AccountType.COMPANY,
    );
  }

  toJson(): any {
    return {
      accountId: this.accountId,
      type: this.getType(),
      status: this.status,
      owner: this.owner.toJson(),
      members: this.businessMembers.map((b: IOwnerAccount) => b.toJson()),
    };
  }
}
