import { AccountType } from "../enums/account_type";
import { AccountStatus } from "../enums/account_status";
import { IOwnerAccount } from "../interfaces/owner_account.interface";
import { AccountHashNoPartners } from "../exceptions/account_has_no_partners";

export abstract class Account {
  protected accountId: string;
  protected status: AccountStatus;
  protected type: AccountType;
  protected owner: IOwnerAccount;
  protected businessMembers: IOwnerAccount[];

  getOwnerAccount(): IOwnerAccount {
    return this.owner;
  }

  getAccountId(): string {
    return this.accountId;
  }

  getType(): AccountType {
    return this.type;
  }

  getPartners(): IOwnerAccount[] {
    if (this.businessMembers.length === 0) {
      throw new AccountHashNoPartners(this.accountId);
    }
    return this.businessMembers;
  }

  abstract toJson(): any;
}
