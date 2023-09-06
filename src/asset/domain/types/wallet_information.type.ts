import { OriginWallet } from "../../../wallet";
import { Address } from "../../../shared";

export type WalletInformationDTO = {
  assetId: string;
  address: string;
  originWallet: OriginWallet;
  institutionName?: string;
  institutionAddress?: Address;
};
