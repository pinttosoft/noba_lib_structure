import { IOwnerAccount } from "./owner_account.interface";
import { AccountType } from "../enums/account_type.enum";
import { AccountStatus } from "../enums/account_status.enum";

export interface IAccount {
  getId(): string;
  toPrimitives(): any;
  getOwnerAccount(): IOwnerAccount;
  getAccountId(): string;
  getType(): AccountType;
  getApprovalDate(): Date;
  getStatus(): AccountStatus;
  getApprovalDate(): Date;
  getCreatedAt(): Date;
}
