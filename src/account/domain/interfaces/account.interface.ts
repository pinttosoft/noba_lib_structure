import { IOwnerAccount } from "./owner_account.interface";
import { AccountType } from "../enums/account_type";

export interface IAccount {
  toJson(): any;
  getOwnerAccount(): IOwnerAccount;
  getAccountId(): string;
  getType(): AccountType;
  getPartners(): IOwnerAccount[];
}
