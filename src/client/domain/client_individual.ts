import { Individual } from "./types/Individual.type";
import { Client } from "@/client/domain/abtracts/client.abstract";
import { AccountType } from "@/account/domain/enums/account_type";
import { IClient } from "@/client/domain/interfaces/client.interface";
import { IAccount } from "@/account/domain/interfaces/account.interface";

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
