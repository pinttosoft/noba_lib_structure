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

  getAssetCode(): string {
    return this.code;
  }

  getName(): string {
    return this.name;
  }

  isCryptoAsset(): boolean {
    return this.code !== "USD";
  }
}
