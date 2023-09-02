import { BeneficiaryAsset } from "../beneficiary_asset";
import { Paginate } from "../../../shared";

export interface IBeneficiaryAssetRepository {
  upsertAssetBeneficiary(beneficiary: BeneficiaryAsset): Promise<string | void>;

  findBeneficiaryById(beneficiaryId: string): Promise<BeneficiaryAsset | null>;

  findBeneficiaryByAddressAndAccountId(
    accountId: string,
    address: string,
  ): Promise<BeneficiaryAsset | null>;

  findBeneficiariesByAccountId(
    accountId: string,
    initDoc?: string,
  ): Promise<Paginate<BeneficiaryAsset> | null>;
}
