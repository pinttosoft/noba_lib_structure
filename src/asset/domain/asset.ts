export class Asset {
  constructor(
    private readonly assetId: string,
    private readonly code: string,
    private readonly icon: string,
    private readonly name: string,
    private readonly network: string,
    private readonly networkName?: string,
  ) {}
  getAssetId() {
    return this.assetId;
  }

  isCryptoAsset(): boolean {
    return this.code !== "USD";
  }
}
