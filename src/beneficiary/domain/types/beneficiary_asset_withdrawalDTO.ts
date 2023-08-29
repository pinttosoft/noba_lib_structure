export type Beneficiary_asset_withdrawalDTO = {
  id?: string;
  accountId: string;
  assetId: string;
  walletAddress: string;
  label: string;
  assetTransferMethod?: string;
};
