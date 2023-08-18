import { AccountType } from "./enums/account_type";
import { AccountStatus } from "./enums/account_status";
import { IOwnerAccount } from "./interfaces/owner_account.interface";

export abstract class Account {
  protected accountId: string;
  protected status: AccountStatus;
  protected type: AccountType;
  protected owner: IOwnerAccount;

  getOwnerAccount(): IOwnerAccount {
    return this.owner;
  }

  getAccountId(): string {
    return this.accountId;
  }

  abstract toJson(): any;
}
