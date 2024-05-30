import { Criteria, Paginate } from "../../../shared";
import { Counterparty } from "../counterparty.abstract";
import { CounterpartyType } from "../enums/counterparty_type.enum";

export interface ICounterpartyRepository {
  upsert(counterparty: Counterparty): Promise<void>;

  findByClientIdAndCounterpartyType(
    clientId: string,
    counterpartyType: CounterpartyType,
  ): Promise<Paginate<Counterparty> | undefined>;

  findByClientIdAndAddressPayment(
    clientId: string,
    addressPayment: string,
  ): Promise<Counterparty | undefined>;

  findByCounterpartyId(
    counterpartyId: string,
  ): Promise<Counterparty | undefined>;

  findByCounterpartyIdAndAssetId(
    counterpartyId: string,
    assetId: string,
  ): Promise<Counterparty | undefined>;

  findMyCounterpartyByAssetId(
    clientId: string,
    counterpartyId: string,
    assetId: string,
  ): Promise<Counterparty | undefined>;

  findByClientIdAndCounterPartyIdAndAssetId(
    clientId: string,
    counterpartyId: string,
    assetId: string,
    isInternal?: "S" | "N"
  ): Promise<Counterparty | undefined>;

  delete(counterpartyId: string): Promise<void>;

  list(
    criteria: Criteria,
    assetCode?: string,
  ): Promise<Paginate<Counterparty> | undefined>;
}
