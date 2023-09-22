import { Transaction } from "../transaction";
import { TransactionDTO } from "../types/transaction.type";
import { Criteria, Paginate, WithdrawalStatus } from "../../../shared";

export interface ITransactionRepository {
  historyTransactionByAssetIdAndClientId(
    clientId: string,
    assetCode: string,
    initDoc: number,
  ): Promise<Paginate<Transaction>>;

  upsert(transaction: Transaction): Promise<void>;

  findTransactionByClientId(
    accountId: string,
    initDoc: number,
  ): Promise<Paginate<Transaction> | undefined>;

  findTransactionByTransactionId(
    transactionId: string,
  ): Promise<Transaction | null>;

  findDepositByAssetIdAndAmountAndStatusAndReference(
    assetCode: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<Transaction | undefined>;

  transactionListing(criteria: Criteria): Promise<Paginate<Transaction>>;

  findWithdrawalByClientIdAndAssetIdAndAmountAndStatusAndReference(
    clientId: string,
    assetCode: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<Transaction | undefined>;
}
