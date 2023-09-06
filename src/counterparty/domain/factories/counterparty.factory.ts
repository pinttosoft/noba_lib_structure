import { CounterpartyFactoryDTO } from "../types/counterparty_factory.type";
import { Counterparty } from "../counterparty.abstract";
import { CounterpartyBank } from "../../../banking/domain/counterpartyBank";
import { CounterpartyType } from "../enums/counterparty_type.enum";
import { Address, GenericException } from "../../../shared";
import { CounterpartyAsset } from "../../../asset/domain/counterparty_asset";

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
    );
  }

  private static factoryCounterpartyBank(
    counterparty: CounterpartyFactoryDTO,
  ): Counterparty {
    return CounterpartyBank.newCounterparty(
      counterparty.client,
      counterparty.informationOwner.name,
      counterparty.informationOwner.address as Address,
      counterparty.informationBank.accountNumber,
      counterparty.informationBank.swiftCodeOrRoutingNumber,
      counterparty.informationBank.networkBank,
      counterparty.informationBank.address,
      counterparty.informationBank.bankName,
      counterparty.informationBank.type,
    );
  }
}
