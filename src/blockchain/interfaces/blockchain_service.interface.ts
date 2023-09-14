import { InstructionDepositCrypto, WalletType } from "../../wallet";
import { IClient } from "../../client";

export interface IBlockchainService {
  lookWalletAddress(
    label: string,
    client: IClient,
    assetId: string,
    walletType: WalletType,
  ): Promise<InstructionDepositCrypto>;
}
