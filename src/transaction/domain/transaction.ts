import { AggregateRoot } from "../../shared/domain/aggregate_root";
import {
  Beneficiary_asset_withdrawalDTO,
  BeneficiaryBankWithdrawalDTO,
} from "../../beneficiary";
import { TransactionType } from "./enums/transaction_type.enum";
import { StringValueObject, WithdrawalStatus } from "../../shared";

export class Transaction extends AggregateRoot {
  private id?: string;
  private transactionId: string;
  private accountId: string;
  private assetCode: string;
  private to?: BeneficiaryBankWithdrawalDTO | Beneficiary_asset_withdrawalDTO;
  private nameTo?: string;
  private emailTo?: string;
  private accountTo?: string;
  private amount: number;
  private transactionType: TransactionType;
  private reference: string;
  private isInternal: boolean;
  private status: WithdrawalStatus;
  private createdAt: Date;

  static newTransaction(
    transactionId: string,
    accountId: StringValueObject,
    assetCode: string,
    amount: number,
    transactionType: TransactionType,
    reference: string,
    isInternal: boolean,
    status?: WithdrawalStatus,
    to?: BeneficiaryBankWithdrawalDTO | Beneficiary_asset_withdrawalDTO,
    nameTo?: string,
    emailTo?: string,
    accountTo?: string,
  ): Transaction {
    return new Transaction();
  }

  static fromPrimitives(
    id: string,
    transactionId: string,
    accountId: StringValueObject,
    assetCode: string,
    amount: number,
    transactionType: TransactionType,
    reference: string,
    isInternal: boolean,
    status?: WithdrawalStatus,
    to?: BeneficiaryBankWithdrawalDTO | Beneficiary_asset_withdrawalDTO,
    nameTo?: string,
    emailTo?: string,
    accountTo?: string,
  ): Transaction {
    const t: Transaction = new Transaction();
    t.transactionId = transactionId;
    t.accountId = accountId.toString();
    t.assetCode = assetCode;
    t.amount = amount;
    t.transactionType = transactionType;
    t.reference = reference;
    t.isInternal = isInternal;
    t.status = status ?? WithdrawalStatus.IN_PROCESS;
    t.to = to;
    t.nameTo = nameTo;
    t.emailTo = emailTo;
    t.accountTo = accountTo;

    return t;
  }

  getId() {
    return this.id;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      transactionId: this.transactionId,
      accountId: this.accountId,
      assetCode: this.assetCode,
      to: this.to,
      nameTo: this.nameTo,
      emailTo: this.emailTo,
      accountTo: this.accountTo,
      amount: this.amount,
      transactionType: this.transactionType,
      reference: this.reference,
      isInternal: this.isInternal,

      status: WithdrawalStatus,
      createdAt: Date,
    };
  }
}
