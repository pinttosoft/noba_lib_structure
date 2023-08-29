import { AggregateRoot } from "@/shared/domain/aggregate_root";
import { AccountStatus } from "@/account/domain/enums/account_status.enum";
import { AccountType } from "@/account/domain/enums/account_type.enum";
import { IOwnerAccount } from "@/account/domain/interfaces/owner_account.interface";
import { AccountHashNoPartners } from "@/account/domain/exceptions/account_has_no_partners";
import { IAccount } from "@/account/domain/interfaces/account.interface";

export class Account extends AggregateRoot implements IAccount {
  private id?: string;
  protected accountId: string;
  protected status: AccountStatus;
  protected type: AccountType;
  protected owner: IOwnerAccount;
  protected companyPartners: IOwnerAccount[];

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
