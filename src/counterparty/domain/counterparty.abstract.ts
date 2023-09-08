import { AggregateRoot } from "../../shared/domain/aggregate_root";

export abstract class Counterparty extends AggregateRoot {
  id?: string;
  counterpartyId: string;
  counterpartyType: string;
  clientId: string;
  accountId: string;
  ownerName: string;
  assetId: string;

  getId(): string | undefined {
    return this.id;
  }

  getAssetId() {
    return this.assetId;
  }

  getCounterpartyType(): string {
    return this.counterpartyType;
  }

  getCounterpartyId(): string {
    return this.counterpartyId;
  }

  getAccountId() {
    return this.accountId;
  }
}
