import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { RelationshipConsumer } from "./enums/relationship_consumer.enum";
import { Address, removeAccents } from "../../shared";
import { CounterpartyProfileType } from "./enums/counterparty_profile_type.enum";
import { CounterpartyStatus } from "./enums/counterparty_status.enum";
import { WalletProvider } from "../../wallet";

export abstract class Counterparty extends AggregateRoot {
  protected id?: string;
  protected counterpartyId: string;
  protected counterpartyType: string;
  protected clientId: string;
  protected accountId: string;
  protected ownerName: string;
  protected ownerCountry: string;
  protected assetId: string;
  protected relationshipConsumer?: RelationshipConsumer;
  protected createdAt: Date;
  protected isInternal: boolean;
  protected profileType: CounterpartyProfileType;
  protected status: CounterpartyStatus;
  protected registeredInProvider: WalletProvider;

  getId(): string | undefined {
    return this.id;
  }

  getRegisteredInProvider(): WalletProvider {
    return this.registeredInProvider;
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

  getStatus(): CounterpartyStatus {
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

  setStatus(status: CounterpartyStatus): void {
    this.status = status;
  }

  abstract getName(): string;

  setOwnerName(ownerName: string) {
    this.ownerName = removeAccents(ownerName);
  }
}
