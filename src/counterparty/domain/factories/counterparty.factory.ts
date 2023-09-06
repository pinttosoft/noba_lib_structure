import { CounterpartyFactoryDTO } from "../types/counterparty_factory.type";
import { Counterparty } from "../counterparty.abstract";
import { CounterpartyBank } from "../../../banking/domain/counterpartyBank";
import { CounterpartyType } from "../enums/counterparty_type.enum";
import { Address, GenericException } from "../../../shared";
import { CounterpartyAsset } from "../../../asset/domain/counterparty_asset";
import { v4 } from "uuid";

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
    return CounterpartyBank.newCounterparty({
      accountNumber: counterparty.informationBank.accountNumber,
      counterpartyId: v4(),
      counterpartyType: counterparty.informationBank.type,
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
}
