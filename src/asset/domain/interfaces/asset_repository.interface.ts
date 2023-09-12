import { Asset } from "../asset";

export interface IAssetRepository {
  findAssetByCode(code: string): Promise<Asset | undefined>;

  findById(assetId: string): Promise<Asset | undefined>;

  all(): Promise<Asset[]>;

  findByStatus(status: boolean): Promise<Asset[]>;
}
