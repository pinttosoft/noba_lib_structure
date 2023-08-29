import { Criteria } from "@/shared/domain/criteria";
import { BeneficiaryDTO, BeneficiaryInternal } from "@/beneficiary";
import { Paginate } from "@/shared/domain/types/paginate";

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
