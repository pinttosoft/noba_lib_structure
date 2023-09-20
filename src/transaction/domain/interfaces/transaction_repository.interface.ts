import { Transaction } from "../transaction";
import { TransactionDTO } from "../types/transaction.type";
import { Criteria, Paginate, WithdrawalStatus } from "../../../shared";

export interface ITransactionRepository {
  historyTransactionByAssetCodeAndClientId(
    clientId: string,
    assetCode: string,
    initDoc?: string | Number,
  ): Promise<Paginate<TransactionDTO> | null>;

  upsertTransaction(transaction: Transaction): Promise<void>;

  findTransactionByClientId(
    accountId: string,
    initDoc?: string,
  ): Promise<Paginate<TransactionDTO> | null>;

  findTransactionByTransactionId(
    transactionId: string,
  ): Promise<TransactionDTO | null>;

  findDepositByAssetCodeAndAmountAndStatusAndReference(
    assetCode: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<TransactionDTO | null>;

  transactionListing(criteria: Criteria): Promise<Paginate<TransactionDTO>>;

  findWithdrawalByClientIdAndAssetCodeAndAmountAndStatusAndReference(
    clientId: string,
    assetCode: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<TransactionDTO>;
}
