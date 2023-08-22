import { AccountStatus } from "../enums/account_status";
import { AccountType } from "../enums/account_type";
import { IOwnerAccount } from "../interfaces/owner_account.interface";

export type Account = {
  accountId?: string;
  status: AccountStatus;
  type: AccountType;
  owner: IOwnerAccount;
  businessMembers?: IOwnerAccount[];
};
