import { Counterparty } from "../counterparty";
import { Criteria, Paginate } from "../../../shared";
import { CounterpartyDTO } from "../types/counterparty.type";

export interface ICounterpartyRepository {
  upsert(counterparty: Counterparty): Promise<void>;

  findByClientId(clientId: string): Promise<Counterparty | undefined>;

  list(criteria: Criteria): Promise<Paginate<CounterpartyDTO> | undefined>;
}
