import { AggregateRoot } from "@/shared/domain/aggregate_root";

export class BeneficiaryAsset extends AggregateRoot {
  private id?: string;
  private accountId: string;
  private assetId: string;
  private walletAddress: string;
  private label: string;
  private assetTransferMethod?: string;

  static newBeneficiaryAsset(
    accountId: string,
    assetId: string,
    walletAddress: string,
    label: string,
    assetTransferMethod?: string,
  ): BeneficiaryAsset {
    const b: BeneficiaryAsset = new BeneficiaryAsset();

    b.accountId = accountId;
    b.assetId = assetId;
    b.walletAddress = walletAddress;
    b.label = label;
    b.assetTransferMethod = assetTransferMethod;

    return b;
  }

  static fromPrimitives(id: string, data: any): BeneficiaryAsset {
    const b: BeneficiaryAsset = BeneficiaryAsset.newBeneficiaryAsset(
      data["accountId"],
      data["assetId"],
      data["walletAddress"],
      data["label"],
      data["assetTransferMethod"],
    );
    b.setId(id);

    return b;
  }

  setId(id: string) {
    this.id = id;
  }

  getId(): string | undefined {
    return this.id;
  }

  toPrimitives(): any {
    return {
      accountId: this.accountId,
      assetId: this.assetId,
      walletAddress: this.walletAddress,
      label: this.label,
      assetTransferMethod: this.assetTransferMethod,
    };
  }
}
