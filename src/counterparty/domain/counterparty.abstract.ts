import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { RelationshipConsumer } from "./enums/relationship_consumer.enum";
import { Address, removeAccents } from "../../shared";
import { CounterpartyProfileType } from "./enums/counterparty_profile_type.enum";
import { CounterpartyStatus } from "./enums/counterparty_status.enum";

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
  protected status: CounterpartyStatus;

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

  getCounterpartyStatus(): CounterpartyStatus {
    return this.status;
  }

  // override
  getInformationOwner():
    | { name: string; address: Address }
    | { name: string; country: string } {
    return {
      name: "string",
      address: {
        streetOne: "",
        streetTwo: "",
        postalCode: "",
        city: "",
        region: "",
        country: "",
      },
    };
  }

  setCounterpartyStatus(status: CounterpartyStatus): void {
    this.status = status;
  }

  abstract getName(): string;

  setOwnerName(ownerName: string) {
    this.ownerName = removeAccents(ownerName);
  }
}
