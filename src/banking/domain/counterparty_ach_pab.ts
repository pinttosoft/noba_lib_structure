import { CounterpartyStatus } from "../../counterparty";
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
  private createdAt: Date;
  private isInternal: boolean;
  private status: CounterpartyStatus;
  private achInstructions: InstructionsAchPabType;

  static newCounterparty(
    data: CounterpartyAchPabDtoType,
    isInternal: boolean = false,
  ): CounterpartyAchPab {
    const c: CounterpartyAchPab = new CounterpartyAchPab();
    c.isInternal = isInternal;
    c.clientId = data.clientId;
    c.accountId = data.accountId;
    c.counterpartyType = data.counterpartyType;
    c.counterpartyId = data.counterpartyId;
    c.counterpartyType = data.counterpartyType;
    c.assetId = data.assetId;
    c.createdAt = new Date();
    c.status = data.status;
    c.achInstructions = data.achInstructions;

    return c;
  }

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

  getStatus(): CounterpartyStatus {
    return this.status;
  }

  getAchInstructions() {
    return this.achInstructions;
  }

  fromPrimitives(id: string, data: any): CounterpartyAchPab {
    const c: CounterpartyAchPab = new CounterpartyAchPab();
    c.isInternal = data.isInternal;
    c.clientId = data.clientId;
    c.accountId = data.accountId;
    c.counterpartyType = data.counterpartyType;
    c.counterpartyId = data.counterpartyId;
    c.counterpartyType = data.counterpartyType;
    c.assetId = data.assetId;
    c.createdAt = new Date();
    c.status = data.status;
    c.achInstructions = data.achInstructions;

    return c;
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
