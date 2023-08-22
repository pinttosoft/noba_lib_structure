import { Account } from "./abstracts/account.abstract";
import { Individual } from "../../client/domain/types/Individual";
import { IAccount } from "./interfaces/account.interface";
import { OwnerAccount } from "./factories/owner_account.facytory";
import { AccountType } from "./enums/account_type";

export class IndividualAccount extends Account implements IAccount {
  constructor(private readonly individual: Individual) {
    super();
    this.createOwnerAccount();
  }

  private createOwnerAccount() {
    this.owner = OwnerAccount.factoryOwnerAccount(
      this.individual,
      AccountType.INDIVIDUAL,
    );
  }

  toJson(): any {
    return {
      accountId: this.accountId,
      type: this.getType(),
      status: this.status,
      owner: this.owner.toJson(),
    };
  }
}
