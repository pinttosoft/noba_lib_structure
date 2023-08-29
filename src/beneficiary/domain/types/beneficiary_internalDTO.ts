import { BeneficiaryDTO } from "@/beneficiary";

export type BeneficiaryInternalDTO = {
  id?: string;
  accountId: string;
  beneficiaries: BeneficiaryDTO[];
  type: string;
};
