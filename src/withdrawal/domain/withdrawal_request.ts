import { AggregateRoot } from "../../shared/domain/aggregate_root";

import { WithdrawalType } from "./enums/withdrawal_type.enum";
import { IClient } from "../../client";
import { Counterparty } from "../../counterparty";
import {
  AmountValueObject,
  GenericException,
  WithdrawalStatus,
} from "../../shared";
import { v4 } from "uuid";
import { WithdrawalPurpose } from "./enums/withdrawal_purpose.enum";

export class WithdrawalRequest extends AggregateRoot {
  private id?: string;
  private withdrawalId: string;
  private clientId: string;
  private amount: number;
  private reference: string;
  private status: WithdrawalStatus;
  private withdrawalType: WithdrawalType;
  private observation?: string;
  private createdAt: Date;
  private dateWasProcessed?: Date;
  private counterparty: Counterparty;
  private withdrawalPurpose?: WithdrawalPurpose;

  getId(): string {
    return this.id;
  }

  static createNewWithdrawalRequest(
    client: IClient,
    counterparty: Counterparty,
    amount: AmountValueObject,
    reference: string,
    withdrawalType: WithdrawalType = WithdrawalType.EXTERNAL,
    withdrawalPurpose?: WithdrawalPurpose,
  ): WithdrawalRequest {
    const w: WithdrawalRequest = new WithdrawalRequest();

    w.withdrawalId = v4();
    w.clientId = client.getClientId();
    w.counterparty = counterparty;
    w.amount = amount.getValue();
    w.reference = reference;
    w.status = WithdrawalStatus.PENDING;
    w.createdAt = new Date();
    w.withdrawalType = withdrawalType;

    if (withdrawalType === WithdrawalType.EXTERNAL) {
      if (!withdrawalPurpose) {
        throw new GenericException(
          "The purpose of the external transfer is required.",
        );
      }
      w.withdrawalPurpose = withdrawalPurpose;
    }

    return w;
  }

  static fromPrimitives(
    id: string,
    plainData: any,
    counterparty: Counterparty,
  ): WithdrawalRequest {
    const w: WithdrawalRequest = new WithdrawalRequest();

    w.id = id;
    w.clientId = plainData.clientId;
    w.amount = plainData.amount;
    w.counterparty = counterparty;
    w.reference = plainData.reference;
    w.status = plainData.status;
    w.withdrawalType = plainData.withdrawalType;
    w.observation = plainData.observation ?? null;
    w.createdAt = plainData.createdAt;
    w.dateWasProcessed = plainData.dateWasProcessed ?? null;
    w.withdrawalPurpose = plainData.withdrawalPurpose ?? null;

    return w;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getReference(): string {
    return this.reference;
  }

  getClientId(): string {
    return this.clientId;
  }

  markAsProcessed(): WithdrawalRequest {
    this.status = WithdrawalStatus.PROCESSED;
    this.dateWasProcessed = new Date();
    return this;
  }

  flagWithProcessingError(observation: string): WithdrawalRequest {
    this.status = WithdrawalStatus.PROCESS_WITH_ERROR;
    this.observation = observation;
    return this;
  }

  setUpdateStatus(status: WithdrawalStatus): WithdrawalRequest {
    this.status = status;
    return this;
  }

  getStatus(): WithdrawalStatus {
    return this.status;
  }

  getWithdrawalId(): string {
    return this.withdrawalId;
  }

  isInternal(): boolean {
    return this.withdrawalType === WithdrawalType.INTERNAL;
  }

  getAmount() {
    return this.amount;
  }

  getCounterparty(): Counterparty {
    return this.counterparty;
  }

  getPurpose(): WithdrawalPurpose {
    return this.withdrawalPurpose;
  }

  toPrimitives(): any {
    return {
      withdrawalId: this.withdrawalId,
      clientId: this.clientId,
      amount: this.amount,
      counterparty: this.counterparty,
      reference: this.reference,
      status: this.status,
      withdrawalType: this.withdrawalType,
      observation: this.observation,
      createdAt: this.createdAt,
      processingDate: this.dateWasProcessed,
      withdrawalPurpose: this.withdrawalPurpose,
    };
  }
}
