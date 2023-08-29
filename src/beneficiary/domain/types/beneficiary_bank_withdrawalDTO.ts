import { TypeBankingData, IntermediaryBankDTO } from "@/banking";

export type BeneficiaryBankWithdrawalDTO = {
  id?: string;
  accountId?: string;
  realName: string;
  accountNumber: string;
  routingNumber?: string;
  bankName: string;
  swiftCode?: string;

  streetOne: string;
  streetTwo?: string;
  postalCode: string;
  country: string;
  city: string;
  state: string;

  typeBeneficiaryBankWithdrawal: TypeBankingData;
  iban?: string;
  intermediaryBank?: IntermediaryBankDTO;
  fundsTransferMethods?: string;
};
