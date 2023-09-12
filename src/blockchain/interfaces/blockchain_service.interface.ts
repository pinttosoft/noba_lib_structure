import { InstructionDepositCrypto, WalletType } from "../../wallet";

export interface IBlockchainService {
  lookWalletAddress(
    label: string,
    accountId: string,
    assetId: string,
    walletType: WalletType,
  ): Promise<InstructionDepositCrypto>;
}
