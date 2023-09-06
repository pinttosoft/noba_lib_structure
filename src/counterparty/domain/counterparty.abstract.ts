import { AggregateRoot } from "../../shared/domain/aggregate_root";

export abstract class Counterparty extends AggregateRoot {
  id?: string;
  counterpartyId: string;
  counterpartyType: string;
  clientId: string;
  accountId: string;
  ownerName: string;

  getId(): string | undefined {
    return this.id;
  }

  getCounterpartyId(): string {
    return this.counterpartyId;
  }

  getAccountId() {
    return this.accountId;
  }
}
