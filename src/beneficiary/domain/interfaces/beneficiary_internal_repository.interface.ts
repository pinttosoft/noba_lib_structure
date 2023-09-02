import { Criteria, Paginate } from "../../../shared";
import { BeneficiaryInternal } from "../beneficiary_internal";
import { BeneficiaryDTO } from "../types/beneficiaryDTO";

export interface IBeneficiaryInternalRepository {
  findByAccountIdAndType(
    criteria: Criteria,
  ): Promise<BeneficiaryInternal | undefined>;

  findBeneficiariesByAccountIdAndPage(
    accountId: string,
    type: string,
    page: number,
    rowPerPage: number,
  ): Promise<Paginate<BeneficiaryDTO>>;

  findBeneficiaryByAccountIdAndEmail(
    accountId: string,
    emailOfBeneficiary: string,
  ): Promise<BeneficiaryDTO | undefined>;

  searchBeneficiaryByBeneficiaryAccountId(
    accountId: string,
  ): Promise<BeneficiaryDTO | undefined>;

  updateOrAddCommonBeneficiary(beneficiary: BeneficiaryInternal): Promise<void>;
}
