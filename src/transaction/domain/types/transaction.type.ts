import { WithdrawalStatus } from "@/shared/domain/enums/withdrawal_status.enum";
import { TransactionType } from "@/transaction";
import {
  Beneficiary_asset_withdrawalDTO,
  BeneficiaryBankWithdrawalDTO,
} from "@/beneficiary";

export type TransactionDTO = {
  id?: string;
  transactionId: string;
  accountId: string;
  assetCode: string;
  to?: BeneficiaryBankWithdrawalDTO | Beneficiary_asset_withdrawalDTO;

  nameTo?: string;
  emailTo?: string;
  accountTo?: string;

  amount: number;
  transactionType: TransactionType;

  reference: string;

  isInternal: boolean;

  status: WithdrawalStatus;
  createdAt: Date;
};
