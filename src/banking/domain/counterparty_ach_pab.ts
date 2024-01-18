import {
  CounterpartyProfileType,
  CounterpartyStatus,
  RelationshipConsumer,
} from "../../counterparty";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { InstructionsAchPabType } from "./types/instructions_ach_pab.type";
import { CounterpartyAchPabDtoType } from "./types/counterparty_ach_pab_dto.type";

export class CounterpartyAchPab extends AggregateRoot {
  private id?: string;
  private counterpartyId: string;
  private counterpartyType: string;
  private clientId: string;
  private accountId: string;
  private assetId: string;
  private relationshipConsumer: RelationshipConsumer;
  private createdAt: Date;
  private isInternal: boolean;
  private profileType: CounterpartyProfileType;
  private status: CounterpartyStatus;
  private achInstructions: InstructionsAchPabType;

  static newCounterparty(
    data: CounterpartyAchPabDtoType,
    isInternal: boolean = false,
  ): CounterpartyAchPab {
    const c: CounterpartyAchPab = new CounterpartyAchPab();
    c.isInternal = isInternal;
    c.clientId = data.clientId;
    c.counterpartyType = data.counterpartyType;
    c.counterpartyId = data.counterpartyId;
    c.counterpartyType = data.counterpartyType;
    c.assetId = data.assetId;
    c.relationshipConsumer = data.relationshipConsumer;
    c.createdAt = new Date();
    c.profileType = data.profileType;
    c.status = data.status;
    c.achInstructions = data.achInstructions;

    return c;
  }

  getId(): string {
    return "";
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

  getAchInstructions() {
    return this.achInstructions;
  }

  fromPrimitive(id: string, data: any): CounterpartyAchPab {
    const counterparty: CounterpartyAchPab = new CounterpartyAchPab();
    counterparty.id = id;

    counterparty.counterpartyId = data.counterpartyId;

    counterparty.profileType = data.profileType ?? "";

    counterparty.clientId = data.clientId;
    counterparty.accountId = data.accountId;
    counterparty.counterpartyType = data.counterpartyType;
    counterparty.createdAt = data.createdAt;
    counterparty.isInternal = data.isInternal === "S";

    counterparty.status = data.status;

    return counterparty;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      assetId: this.assetId,
      clientId: this.clientId,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      accountId: this.accountId,
      achInstructions: this.achInstructions,
      isInternal: this.isInternal === true ? "S" : "N",
      createdAt: this.createdAt,
      status: this.status,
    };
  }
}
