import {
  Beneficiary_asset_withdrawalDTO,
  BeneficiaryBankWithdrawalDTO,
} from "../../../beneficiary";
import { TransactionType } from "../enums/transaction_type.enum";
import { WithdrawalStatus } from "../../../shared";

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
