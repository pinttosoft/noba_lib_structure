import { CounterpartyFactoryDTO } from "../types/counterparty_factory.type";
import { Counterparty } from "../counterparty.abstract";
import { CounterpartyBank } from "../../../banking/domain/counterpartyBank";
import { CounterpartyType } from "../enums/counterparty_type.enum";
import { Address, GenericException } from "../../../shared";
import { v4 } from "uuid";
import { CounterpartyAsset } from "../../../asset";

export class CounterpartyFactory {
  static createNewCounterparty(
    counterparty: CounterpartyFactoryDTO,
  ): Counterparty {
    try {
      if ((counterparty.type = CounterpartyType.FIAT)) {
        return CounterpartyFactory.factoryCounterpartyBank(counterparty);
      }

      return CounterpartyFactory.factoryCounterpartyAsset(counterparty);
    } catch (e) {
      throw new GenericException(e.message);
    }
  }

  private static factoryCounterpartyAsset(
    counterparty: CounterpartyFactoryDTO,
  ): Counterparty {
    return CounterpartyAsset.newCounterparty(
      counterparty.client,
      counterparty.informationOwner.name,
      counterparty.informationOwner.address.country,
      counterparty.informationWallet,
    );
  }

  private static factoryCounterpartyBank(
    counterparty: CounterpartyFactoryDTO,
  ): Counterparty {
    const counterpartyType =
      "FIAT_" + counterparty.informationBank.address.country;

    return CounterpartyBank.newCounterparty({
      assetId: CounterpartyFactory.getAssetId(),
      accountNumber: counterparty.informationBank.accountNumber,
      counterpartyId: v4(),
      counterpartyType: counterpartyType,
      clientId: counterparty.client.getClientId(),
      accountId: counterparty.client.getAccount().getAccountId(),
      routingNumber: counterparty.informationBank.swiftCodeOrRoutingNumber,
      swiftCode: counterparty.informationBank.swiftCodeOrRoutingNumber,
      informationOwner: {
        ...counterparty.informationOwner,
        address: counterparty.informationOwner.address as Address,
      },
      informationBank: {
        ...counterparty.informationBank,
        address: counterparty.informationBank.address as Address,
      },
    });
  }

  private static getAssetId(): string {
    if (process.env.NODE_ENV === "prod") {
      // TODO assetIde de USD para PROD
      return "";
    }

    return "FIAT_TESTNET_USD";
  }
}
