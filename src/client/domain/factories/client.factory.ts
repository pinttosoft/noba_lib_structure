import { CompanyDTO } from "../types/company.type";
import { IndividualDTO } from "../types/Individual.type";
import { AccountType, IAccount } from "../../../account";
import { IClient } from "../interfaces/client.interface";
import { Client } from "../client";
import { GenericException } from "../../../shared";

export class ClientFactory {
  static createNewClient(
    clientData: IndividualDTO | CompanyDTO,
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

  static fromPrimitives(id: string, data: any, account: IAccount): IClient {
    const c: Client = new Client();

    try {
      c.setId(id)
        .setClientData({ ...data })
        .setAccount(account)
        .setClientType(data.clientType)
        .setTaxId(data.taxId ?? null)
        .build();
    } catch (e) {
      throw new GenericException(e.message);
    }

    return c;
  }
}
