import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { TransactionType } from "./enums/transaction_type.enum";
import { WithdrawalStatus } from "../../shared";

export class TransactionDeposit extends AggregateRoot {
  private transactionId: string;
  private clientId: string;
  private assetId: string;
  private amount: number;
  private transactionType: TransactionType;
  private reference: string;
  private isInternal: boolean;
  private status: WithdrawalStatus;
  private createdAt: Date;

  /**
   *
   * @param depositId
   * @param assetId
   * @param clientId
   * @param amount
   * @param reference
   * @param status Opcional si no se pasa se asume que es PROCESSED
   * @param isInternal
   */
  static newTransactionDeposit(
    depositId: string,
    assetId: string,
    clientId: string,
    amount: number,
    reference: string,
    status: WithdrawalStatus,
    isInternal: boolean = false,
  ) {
    const t = new TransactionDeposit();
    t.transactionId = depositId;
    t.reference = reference;
    t.clientId = clientId;
    t.isInternal = isInternal;
    t.createdAt = new Date();
    t.amount = amount;

    t.transactionType = TransactionType.DEPOSIT;
    t.assetId = assetId;
    t.status = status ?? WithdrawalStatus.PROCESSED;

    return t;
  }

  getId(): string {
    return undefined;
  }

  toPrimitives(): any {
    return {
      transactionId: this.transactionId,
      clientId: this.clientId,
      assetId: this.assetId,
      amount: this.amount,
      transactionType: this.transactionType,
      reference: this.reference,
      isInternal: this.isInternal === true ? "S" : "N",
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
