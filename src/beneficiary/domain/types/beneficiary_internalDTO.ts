import { BeneficiaryDTO } from "./beneficiaryDTO";

export type BeneficiaryInternalDTO = {
  id?: string;
  accountId: string;
  beneficiaries: BeneficiaryDTO[];
  type: string;
};
