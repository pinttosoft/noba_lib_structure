import { WithdrawalRequest } from "../withdrawal_request";
import { Criteria, Paginate } from "../../../shared";

export interface IWithdrawalRequestRepository {
  upsert(withdrawal: WithdrawalRequest): Promise<void>;
  findByClient(
    clientId: string,
    page: number,
    rowPerPage: number,
  ): Promise<Paginate<WithdrawalRequest>>;

  findByWithdrawalId(
    withdrawalId: string,
  ): Promise<WithdrawalRequest | undefined>;
  findByWithdrawalIsProcessed(
      ClientId:string,
      status: string, isProccessed:boolean
  ): Promise<WithdrawalRequest | undefined>;

  list(criteria: Criteria): Promise<Paginate<WithdrawalRequest>>;
}
