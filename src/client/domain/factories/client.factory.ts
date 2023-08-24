import { Company, IClient, Individual } from "@/client";
import { Client } from "@/client/domain/client";
import { IAccount } from "@/account/domain/interfaces/account.interface";
import { AccountType } from "@/account/domain/enums/account_type.enum";
import { GenericException } from "@/shared/domain/exceptions/generic_exception";

export class ClientFactory {
  static createNewClient(
    clientData: Individual | Company,
    clientType: AccountType,
    account: IAccount,
  ): IClient {
    const c = new Client();
    c.setAccount(account)
      .setClientType(clientType)
      .setClientData(clientData)
      .build();
    return c;
  }

  static fromJson(id: string, data: any, account: IAccount): IClient {
    const c: Client = new Client();

    try {
      c.setId(id)
        .setClientData({ ...data })
        .setAccount(account)
        .setClientType(data.clientType)
        .build();
    } catch (e) {
      throw new GenericException(e.message);
    }

    return c;
  }
}
