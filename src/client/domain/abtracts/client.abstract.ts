import { AccountType } from "@/account/domain/enums/account_type";

export abstract class Client {
  protected clientId: string;
  protected clientData: any;
  protected clientType: AccountType;

  protected constructor(client: any, type: AccountType, clientId?: string) {
    this.clientType = type;
    if (clientId === undefined) {
      this.createIdentify();
    }
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
