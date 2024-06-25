import {
  GenericException,
  IAssetRepository,
  IWalletRepository,
} from "../../../src";

export class FindWalletOtherService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly assetRepository: IAssetRepository,
  ) {}

  async run(clientId: string, assetCode: string) {
    const asset = await this.assetRepository.findAssetByCode(assetCode);

    const wallet = await this.walletRepository.findWalletsByClientIdAndAssetId(
      clientId,
      asset.getAssetId(),
    );

    if (!wallet) {
      throw new GenericException("Wallet not found");
    }

    return wallet;
  }
}
