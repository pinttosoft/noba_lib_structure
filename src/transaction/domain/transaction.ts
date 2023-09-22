import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { TransactionType } from "./enums/transaction_type.enum";
import { WithdrawalStatus } from "../../shared";
import { Counterparty } from "../../counterparty";
import { v4 } from "uuid";

export class Transaction extends AggregateRoot {
  private id?: string;
  private transactionId: string;
  private clientId: string;
  private assetId: string;
  private amount: number;
  private transactionType: TransactionType;
  private reference: string;
  private isInternal: boolean;
  private counterparty: Counterparty;
  private status: WithdrawalStatus;
  private createdAt: Date;

  static newTransaction(
    transactionId: string,
    amount: number,
    reference: string,
    clientId: string,
    isInternal: boolean,
    counterparty: Counterparty,
    transactionType: TransactionType,
  ): Transaction {
    const t: Transaction = new Transaction();
    t.transactionId = transactionId;

    t.reference = reference;
    t.clientId = clientId;
    t.isInternal = isInternal;
    t.createdAt = new Date();
    t.amount = amount;

    t.status = WithdrawalStatus.IN_PROCESS;
    t.transactionType = transactionType;
    t.counterparty = counterparty;
    t.assetId = counterparty.getAssetId();

    return t;
  }

  static fromPrimitives(
    id: string,
    data: any,
    counterparty: Counterparty,
  ): Transaction {
    const t: Transaction = new Transaction();
    t.clientId = data.clientId;
    t.amount = data.amount;
    t.reference = data.reference;
    t.status = data.status;
    t.transactionType = data.transactionType;
    t.isInternal = data.isInternal;
    t.createdAt = data.createdAt;
    t.id = id;
    t.counterparty = counterparty;
    t.assetId = counterparty.getAssetId();

    return t;
  }

  getId() {
    return this.id;
  }

  getCounterparty(): Counterparty {
    return this.counterparty;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      transactionId: this.transactionId,
      clientId: this.clientId,
      assetId: this.assetId,
      counterparty: this.counterparty.toPrimitives(),
      amount: this.amount,
      transactionType: this.transactionType,
      reference: this.reference,
      isInternal: this.isInternal,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
