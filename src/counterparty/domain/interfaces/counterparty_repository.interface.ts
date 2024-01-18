import { Criteria, Paginate } from "../../../shared";
import { Counterparty } from "../counterparty.abstract";
import { CounterpartyType } from "../enums/counterparty_type.enum";
import { CounterpartyAchPab } from "../../../banking/domain/counterparty_ach_pab";

export interface ICounterpartyRepository {
  upsert(counterparty: Counterparty | CounterpartyAchPab): Promise<void>;

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

  delete(counterpartyId: string): Promise<void>;

  list(criteria: Criteria): Promise<Paginate<Counterparty> | undefined>;
}
