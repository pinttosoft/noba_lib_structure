import { Transaction } from "../transaction";
import { TransactionDTO } from "@/transaction/domain/types/transaction.type";
import { Paginate } from "@/shared/domain/types/paginate";
import { Criteria } from "@/shared/domain/criteria";
import { WithdrawalStatus } from "@/shared/domain/enums/withdrawal_status.enum";

export interface ITransactionRepository {
  historyTransactionByAssetCodeAndAccountId(
    accountId: string,
    assetCode: string,
    initDoc?: string | Number,
  ): Promise<Paginate<TransactionDTO> | null>;

  upsertTransaction(transaction: Transaction): Promise<void>;

  findTransactionByAccountId(
    accountId: string,
    initDoc?: string,
  ): Promise<Paginate<TransactionDTO> | null>;

  findByAssetTransferMethodAndStatusAndAmount(
    assetCode: string,
    assetTransferMethod: string,
    status: WithdrawalStatus,
    amount: number,
  ): Promise<TransactionDTO | null>;

  findByFundsTransferMethodAndStatusAndAmount(
    fundsTransferMethod: string,
    status: WithdrawalStatus,
    amount: number,
  ): Promise<TransactionDTO | null>;

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

  findWithdrawalByAccountIdAndAssetCodeAndAmountAndStatusAndReference(
    accountId: string,
    assetCode: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<TransactionDTO>;
}
