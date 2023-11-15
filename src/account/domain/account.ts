import { IAccount } from "./interfaces/account.interface";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { AccountStatus } from "./enums/account_status.enum";
import { AccountType } from "./enums/account_type.enum";
import { IOwnerAccount } from "./interfaces/owner_account.interface";

export class Account extends AggregateRoot implements IAccount {
  private id?: string;
  private accountId: string;
  private applicationId?: string;
  private status: AccountStatus;
  private type: AccountType;
  private owner: IOwnerAccount;
  private createdAt: Date;
  private approvalDate?: Date;

  getId() {
    return this.id;
  }

  setId(id: string): Account {
    this.id = id;
    return this;
  }

  setAccountId(accountId: string): Account {
    this.accountId = accountId;
    return this;
  }

  setAccountType(type: AccountType): Account {
    this.type = type;
    return this;
  }

  setOwner(owner: IOwnerAccount): Account {
    this.owner = owner;
    return this;
  }

  setStatus(status: AccountStatus): Account {
    this.status = status;

    return this;
  }

  build(): void {
    this.accountId =
      this.owner.getName().replace(" ", "").substring(0, 10) +
      "-" +
      this.owner.getIdentifyNumber();
  }

  getOwnerAccount(): IOwnerAccount {
    return this.owner;
  }

  getAccountId(): string {
    return this.accountId;
  }

  getType(): AccountType {
    return this.type;
  }

  getStatus(): AccountStatus {
    return this.status;
  }
  getApprovalDate(): Date {
    return this.approvalDate;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  reject(): void {
    this.status = AccountStatus.REJECTED;
  }

  setApplicationId(applicationId: string): void {
    this.applicationId = applicationId;
  }

  getApplicationId(): string {
    return this.applicationId;
  }

  toPrimitives(): any {
    return {
      approvalDate: this.approvalDate,
      createdAt: this.createdAt,
      accountId: this.accountId,
      type: this.getType(),
      status: this.status,
      owner: this.owner.toPrimitives(),
      applicationId: this.applicationId,
    };
  }
}
