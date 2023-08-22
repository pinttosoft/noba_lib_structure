import { AccountType } from "@/account/domain/enums/account_type";
import { IAccount } from "@/account/domain/interfaces/account.interface";

export abstract class Client {
  protected clientId: string;
  protected clientData: any;
  protected clientType: AccountType;
  protected accountId: string;
  protected account: IAccount;

  protected constructor(
    client: any,
    type: AccountType,
    account: IAccount,
    clientId?: string,
  ) {
    this.accountId = this.account.getAccountId();
    this.clientType = type;
    if (clientId === undefined) {
      this.createIdentify();
    }
  }

  getAccount(): IAccount {
    return this.account;
  }

  protected createIdentify(): void {
    if (this.clientType == AccountType.INDIVIDUAL) {
      this.clientId =
        this.clientData.firstName.substring(0, 1) + this.clientData.lastName;
      this.clientData.dni;
    } else {
      this.clientId =
        this.clientData.name.replace(" ", "-") + this.clientData.dni;
    }
  }

  abstract toJson(): any;
}
