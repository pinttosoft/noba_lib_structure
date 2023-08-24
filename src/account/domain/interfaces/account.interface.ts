import { AccountType, IOwnerAccount } from "@/account";

export interface IAccount {
  toPrimitives(): any;
  getOwnerAccount(): IOwnerAccount;
  getAccountId(): string;
  getType(): AccountType;
  getCompanyPartners(): IOwnerAccount[];
}
