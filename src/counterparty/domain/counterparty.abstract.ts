import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { RelationshipConsumer } from "./enums/relationship_consumer.enum";
import { removeAccents } from "../../shared";
import { CounterpartyProfileType } from "./enums/counterparty_profile_type.enum";

export abstract class Counterparty extends AggregateRoot {
  protected id?: string;
  protected counterpartyId: string;
  protected counterpartyType: string;
  protected clientId: string;
  protected accountId: string;
  protected ownerName: string;
  protected ownerCountry: string;
  protected assetId: string;
  protected relationshipConsumer: RelationshipConsumer;
  protected createdAt: Date;
  protected isInternal: boolean;
  protected profileType: CounterpartyProfileType;

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

  getClientId() {
    return this.clientId;
  }

  getIsInternal(): boolean {
    return this.isInternal;
  }

  getRelationConsumer(): RelationshipConsumer {
    return this.relationshipConsumer;
  }

  abstract getName(): string;

  setOwnerName(ownerName: string) {
    this.ownerName = removeAccents(ownerName);
  }
}
