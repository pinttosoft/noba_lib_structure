import { IOwnerAccount } from "./owner_account.interface";
import { AccountType } from "../enums/account_type.enum";

export interface IAccount {
  toPrimitives(): any;
  getOwnerAccount(): IOwnerAccount;
  getAccountId(): string;
  getType(): AccountType;
  getCompanyPartners(): IOwnerAccount[];
}
