import { WithdrawalRequest } from "../withdrawal_request";
import { Criteria, Paginate } from "../../../shared";
import { WithdrawalType } from "../enums/withdrawal_type.enum";
import { CounterpartyType } from "../../../counterparty";

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

  list(criteria: Criteria): Promise<Paginate<WithdrawalRequest>>;

  getTotalAmountByClientId(
    clientId: string,
    filters: GetTotalAmountByClientIdFilters,
  ): Promise<number>;
}

export type GetTotalAmountByClientIdFilters = {
  withdrawalType?: WithdrawalType;
  status: string;
  counterPartyType: CounterpartyType;
  startDate?: Date;
  endDate?: Date;
};
