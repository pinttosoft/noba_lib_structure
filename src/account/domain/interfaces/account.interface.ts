import { OwnerAccount } from "../owner";

export interface IAccount {
  toJson(): any;
  getOwner(): OwnerAccount;
  getAccountId(): string;
}
