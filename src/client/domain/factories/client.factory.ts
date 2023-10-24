import { CompanyDTO } from "../types/company.type";
import { IndividualDTO } from "../types/Individual.type";
import {
  AccountStatus,
  AccountType,
  IAccount,
  IOwnerAccount,
} from "../../../account";
import { IClient } from "../interfaces/client.interface";
import { Client } from "../client";
import { GenericException } from "../../../shared";
import {
  FeeSwap,
  FeeWire,
  ISystemConfigurationRepository,
  SystemConfigurationMongoRepository,
} from "../../../system_configuration";
import { Documents } from "../../../documents";

export class ClientFactory {
  static async createNewClient(
    clientData: IndividualDTO | CompanyDTO,
    clientType: AccountType,
    account: IAccount,
    companyPartners?: IOwnerAccount[],
  ): Promise<IClient> {
    const systemConfig: ISystemConfigurationRepository =
      SystemConfigurationMongoRepository.instance();

    const c: Client = new Client();
    c.setAccount(account)
      .setStatus(AccountStatus.REGISTERED)
      .setClientType(clientType)
      .setClientData(clientData)
      .setFeeWire(await systemConfig.getDefaultFeeWire())
      .setFeeSwap(await systemConfig.getDefaultFeeSwap())

      .build();

    if (clientType === AccountType.COMPANY) {
      c.setCompanyPartners(companyPartners);
    }

    c.setCreatedAt(new Date());

    return c;
  }

  static fromPrimitives(id: string, data: any, account: IAccount): IClient {
    const c: Client = new Client();

    try {
      c.setId(id)
        .setStatus(data.status)
        .setClientData({ ...data })
        .setAccount(account)
        .setClientType(data.type)
        .setFeeSwap(FeeSwap.fromPrimitives(data.feeSwap))
        .setFeeWire(FeeWire.fromPrimitives(data.feeWire))
        .setTaxId(data.taxId ?? null)
        .setClientId(data.clientId);

      if (data.type !== AccountType.COMPANY) {
        data.documents.forEach((document: any) => {
          c.setDocument(
            data.dni,
            Documents.fromPrimitives({
              ...document,
              clientId: data.clientId,
            }),
          );
        });

        return c;
      }

      c.setDocument(data.informationCompany.registerNumber, data.documents);
      data.partners.forEach((partner: any) => {
        partner.documents.forEach((document: any) => {
          c.setDocument(
            partner.dni,
            Documents.fromPrimitives({
              ...document,
              clientId: data.clientId,
            }),
          );
        });
      });

      return c;
    } catch (e) {
      throw new GenericException(e.message);
    }
  }
}
