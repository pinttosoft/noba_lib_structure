import { IWalletRepository } from "../domain/interfaces/wallet_repository.interface";
import { IWallet } from "../domain/interfaces/wallet.interface";
import { logger, WalletProvider } from "../../index";

export class UpdateLockedBalanceWallet {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async run(
    clientId: string,
    assetId: string,
    amount: number,
    walletProvider: WalletProvider,
  ): Promise<void> {
    const wallet: IWallet =
      await this.walletRepository.findWalletsByClientIdAndAssetId(
        clientId,
        assetId,
        walletProvider,
      );

    logger.info(
      ` clientId${wallet.getClientId()} wallet ${wallet
        .getAsset()
        .getAssetCode()} balance actual ${JSON.stringify(
        wallet.getBalanceAvailable(),
      )}`,
    );

    wallet.updateLockedBalance(amount);

    logger.info(
      ` clientId ${wallet.getClientId()} nuevo balance ${JSON.stringify(
        wallet.getBalanceAvailable(),
      )}`,
    );

    await this.walletRepository.updateBalance(wallet);
  }
}
