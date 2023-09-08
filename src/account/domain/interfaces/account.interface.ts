import { IOwnerAccount } from "./owner_account.interface";
import { AccountType } from "../enums/account_type.enum";

export interface IAccount {
  getId(): string;
  toPrimitives(): any;
  getOwnerAccount(): IOwnerAccount;
  getAccountId(): string;
  getType(): AccountType;
  getCompanyPartners(): IOwnerAccount[];
}
