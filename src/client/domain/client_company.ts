import { Client } from "@/client/domain/abtracts/client.abstract";
import { Individual } from "@/client/domain/types/Individual.type";
import { AccountType } from "@/account/domain/enums/account_type";
import { IAccount } from "@/account/domain/interfaces/account.interface";
import { IClient } from "./interfaces/client.interface";

export class ClientCompany extends Client implements IClient {
  constructor(client: Individual, account: IAccount, clientId?: string) {
    super(client, AccountType.INDIVIDUAL, account, clientId);
  }

  toJson(): any {
    return {
      ...this.clientData,

      accountId: this.accountId,
      clientId: this.clientId,
    };
  }
}
