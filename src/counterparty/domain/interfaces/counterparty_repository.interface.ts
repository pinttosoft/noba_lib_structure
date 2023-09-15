import { Criteria, Paginate } from "../../../shared";
import { CounterpartyBankDTO } from "../../../banking/domain/types/counterparty_bank.type";
import { Counterparty } from "../counterparty.abstract";
import { CounterpartyType } from "../enums/counterparty_type.enum";

export interface ICounterpartyRepository {
  upsert(counterparty: Counterparty): Promise<void>;

  findByClientId(
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

  list(criteria: Criteria): Promise<Paginate<Counterparty> | undefined>;
}
