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
        .build();
    } catch (e) {
      throw new GenericException(e.message);
    }

    return c;
  }
}
