import { Criteria, Paginate } from "../../../shared";
import { CounterpartyDTO } from "../../../banking/domain/types/counterparty.type";
import { Counterparty } from "../counterparty.abstract";

export interface ICounterpartyRepository {
  upsert(counterparty: Counterparty): Promise<void>;

  findByClientId(clientId: string): Promise<Counterparty | undefined>;

  list(criteria: Criteria): Promise<Paginate<CounterpartyDTO> | undefined>;
}
