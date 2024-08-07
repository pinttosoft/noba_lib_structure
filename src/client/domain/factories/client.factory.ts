import { CompanyDTO } from "../types/company.type";
import { IndividualDTO } from "../types/Individual.type";
import {
  AccountStatus,
  AccountType,
  IAccount,
  IOwnerAccount,
  OwnerAccountFactory,
} from "../../../account";
import { IClient } from "../interfaces/client.interface";
import { Client } from "../client";
import { GenericException } from "../../../shared";
import {
  CommissionForRechargingCard,
  FeeACHPanama,
  FeeAchUsd,
  FeeSwap,
  FeeWire,
  ISystemConfigurationRepository,
  SystemConfigurationMongoRepository,
  TransactionalProfile,
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
      .setFeeRechargingCard(await systemConfig.getDefaultFeeRechargingCard())
      .setFeeACHPanama(await systemConfig.getDefaultFeeACHPAB())
      .setFeeAchUsd(await systemConfig.getDefaultFeeAchUsd())

      .build();

    if (clientType === AccountType.COMPANY) {
      c.setCompanyPartners(companyPartners);
    }

    c.setCreatedAt(new Date());

    return c;
  }

  static async fromPrimitives(
    id: string,
    data: any,
    account: IAccount,
  ): Promise<IClient> {
    const c: Client = new Client();

    try {
      const systemConfig: ISystemConfigurationRepository =
        SystemConfigurationMongoRepository.instance();

      const configsSystemTransactionalProfile =
        await systemConfig.getDefaultTransactionalProfile();
      c.setId(id)
        .setStatus(data.status)
        .setClientData({ ...data })
        .setAccount(account)
        .setClientType(data.type)
        .setFeeSwap(FeeSwap.fromPrimitives(data.feeSwap))
        .setFeeWire(FeeWire.fromPrimitives(data.feeWire))
        .setFeeRechargingCard(
          "feeRechargingCard" in data
            ? CommissionForRechargingCard.fromPrimitives(data.feeRechargingCard)
            : await systemConfig.getDefaultFeeRechargingCard(),
        )
        .setTaxId(data.taxId ?? null)
        .setClientId(data.clientId);
      c.setTransactionalProfile(
        "transactionalProfile" in data
          ? TransactionalProfile.fromPrimitives(data.transactionalProfile)
          : data.type == AccountType.COMPANY
            ? configsSystemTransactionalProfile.company
            : configsSystemTransactionalProfile.naturalPerson,
      );

      c.setFeeACHPanama(
        FeeACHPanama.fromPrimitives(
          data.feeACHPanama ?? (await systemConfig.getDefaultFeeACHPAB()),
        ),
      );

      c.setFeeAchUsd(
        FeeAchUsd.fromPrimitives(
          data.feeAchUsd ?? (await systemConfig.getDefaultFeeAchUsd()),
        ),
      );

      // general kyc for COMPANY, and for kyc INDIVIDUAL
      if (data.kycRequestedChanges) {
        data.kycRequestedChanges.map((kycAction) => {
          c.setKycAction(kycAction);
        });
      }

      // natural
      if (data.type === AccountType.INDIVIDUAL) {
        if (!data.documents || data.documents.length === 0) {
          return c;
        }

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

      // company
      if (
        data.documents &&
        Array.isArray(data.documents) &&
        data.documents.length > 0
      ) {
        data.documents.forEach((document: any) => {
          c.setDocument(
            data.informationCompany.registerNumber,
            Documents.fromPrimitives({
              ...document,
              clientId: data.clientId,
            }),
          );
        });
      }

      if (data.partners && data.partners.length === 0) {
        return c;
      }

      if (data.partners && Array.isArray(data.partners)) {
        c.setCompanyPartners(
          data.partners.map((p) =>
            OwnerAccountFactory.factoryOwnerAccount(p, AccountType.INDIVIDUAL),
          ),
        );
      }

      return c;
    } catch (e) {
      throw new GenericException(e.message);
    }
  }
}
