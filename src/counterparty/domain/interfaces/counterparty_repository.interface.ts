import { Criteria, Paginate } from "../../../shared";
import { CounterpartyBankDTO } from "../../../banking/domain/types/counterparty_bank.type";
import { Counterparty } from "../counterparty.abstract";

export interface ICounterpartyRepository {
  upsert(counterparty: Counterparty): Promise<void>;

  findByClientId(clientId: string): Promise<Counterparty | undefined>;

  list(criteria: Criteria): Promise<Paginate<CounterpartyBankDTO> | undefined>;
}
