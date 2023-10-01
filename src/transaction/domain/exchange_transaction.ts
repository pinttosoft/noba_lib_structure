import { TransactionType } from "../index";
import { WithdrawalStatus } from "../../shared";
import { AggregateRoot } from "../../shared/domain/aggregate_root";

export class ExchangeTransaction extends AggregateRoot {
  private transactionId: string;
  private clientId: string;
  private assetId: string;
  private amount: number;
  private transactionType: TransactionType;
  private reference: string;
  private isInternal: boolean;
  private status: WithdrawalStatus;
  private createdAt: Date;

  static newExchangeTransaction(
    exchangeId: string,
    assetId: string,
    clientId: string,
    amount: number,
    reference: string,
    transactionType: TransactionType,
    status?: WithdrawalStatus,
  ): ExchangeTransaction {
    const t = new ExchangeTransaction();
    t.transactionId = exchangeId;
    t.reference = reference;
    t.clientId = clientId;
    t.isInternal = true;
    t.createdAt = new Date();
    t.amount = amount;

    t.transactionType = transactionType;
    t.assetId = assetId;
    t.status = status ?? WithdrawalStatus.IN_PROCESS;

    return t;
  }

  toPrimitives(): any {
    return {
      transactionId: this.transactionId,
      clientId: this.clientId,
      assetId: this.assetId,
      amount: this.amount,
      transactionType: this.transactionType,
      reference: this.reference,
      isInternal: this.isInternal,
      status: this.status,
      createdAt: this.createdAt,
    };
  }

  getId(): string | undefined {
    return undefined;
  }
}
