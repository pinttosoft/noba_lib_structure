import { InstructionDepositCrypto, WalletType } from "../../wallet";
import { IClient } from "../../client";
import { CounterpartyAsset, WalletInformationDTO } from "../../asset";

export interface IBlockchainService {
  lookWalletAddress(
    label: string,
    client: IClient,
    assetId: string,
    walletType: WalletType,
  ): Promise<InstructionDepositCrypto>;

  registerCounterpartyAsset(
    client: IClient,
    informationOwner: {
      name: string;
      country: string;
    },
    informationWallet: WalletInformationDTO,
  ): Promise<CounterpartyAsset>;
}
