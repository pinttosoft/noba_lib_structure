import { TransactionType } from "../index";
import { WithdrawalStatus } from "../../shared";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { Exchange } from "../../exchange";

export class ExchangeTransaction extends AggregateRoot {
  private id?: string;
  private transactionId: string;
  private clientId: string;
  private assetId: string;
  private amount: number;
  private transactionType: TransactionType;
  private reference: string;
  private isInternal: boolean;
  private status: WithdrawalStatus;
  private createdAt: Date;
  private exchange?: Exchange;

  static newExchangeTransaction(
    exchangeId: string,
    assetId: string,
    clientId: string,
    amount: number,
    reference: string,
    transactionType: TransactionType,
    status?: WithdrawalStatus,
    exchange?: Exchange,
  ): ExchangeTransaction {
    const t = new ExchangeTransaction();
    t.transactionId = exchangeId;
    t.reference = reference;
    t.clientId = clientId;
    t.isInternal = false;
    t.createdAt = new Date();
    t.amount = amount;

    t.transactionType = transactionType;
    t.assetId = assetId;
    t.status = status ?? WithdrawalStatus.IN_PROCESS;
    t.exchange = exchange ?? null;

    return t;
  }

  static fromPrimitives(id: string, data: any): ExchangeTransaction {
    const t = new ExchangeTransaction();
    t.clientId = data.clientId;
    t.amount = data.amount;
    t.reference = data.reference;
    t.status = data.status;
    t.transactionType = data.transactionType;
    t.isInternal = data.isInternal === "S";
    t.createdAt = data.createdAt;
    t.assetId = data.assetId;
    t.transactionId = data.transactionId;
    t.id = id;
    t.exchange = data.exchange ?? null;

    return t;
  }

  markAsCompleted(): ExchangeTransaction {
    this.status = WithdrawalStatus.PROCESSED;
    return this;
  }

  cancelTransaction(): ExchangeTransaction {
    this.status = WithdrawalStatus.CANCELLED;
    return this;
  }

  toPrimitives(): any {
    return {
      transactionId: this.transactionId,
      clientId: this.clientId,
      assetId: this.assetId,
      amount: this.amount,
      transactionType: this.transactionType,
      reference: this.reference,
      isInternal: this.isInternal ? "S" : "N",
      status: this.status,
      createdAt: this.createdAt,
      exchange: this.exchange,
    };
  }

  getId(): string | undefined {
    return this.id;
  }
}
