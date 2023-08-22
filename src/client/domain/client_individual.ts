import { AccountType } from "@/account/domain/enums/account_type";

import { IAccount } from "@/account/domain/interfaces/account.interface";
import { IClient, Individual } from "@/client";
import { Client } from "@/client/domain/abtracts/client.abstract";

export class ClientIndividual extends Client implements IClient {
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
