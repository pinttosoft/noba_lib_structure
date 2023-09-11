import { IAccount } from "./interfaces/account.interface";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { AccountStatus } from "./enums/account_status.enum";
import { AccountType } from "./enums/account_type.enum";
import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { AccountHashNoPartners } from "./exceptions/account_has_no_partners";

export class Account extends AggregateRoot implements IAccount {
  private id?: string;
  private accountId: string;
  private status: AccountStatus;
  private type: AccountType;
  private owner: IOwnerAccount;
  private companyPartners: IOwnerAccount[];

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

  setCompanyPartners(partners: IOwnerAccount[]): Account {
    this.companyPartners = partners;
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

  getCompanyPartners(): IOwnerAccount[] {
    if (
      this.companyPartners.length === 0 ||
      this.type === AccountType.INDIVIDUAL
    ) {
      throw new AccountHashNoPartners(this.accountId);
    }

    return this.companyPartners;
  }

  toPrimitives(): any {
    if (this.type === AccountType.COMPANY) {
      return {
        accountId: this.accountId,
        type: this.getType(),
        status: this.status,
        owner: this.owner.toPrimitives(),
        companyPartners: this.companyPartners.map((b: IOwnerAccount) =>
          b.toPrimitives(),
        ),
      };
    }

    return {
      accountId: this.accountId,
      type: this.getType(),
      status: this.status,
      owner: this.owner.toPrimitives(),
    };
  }
}
