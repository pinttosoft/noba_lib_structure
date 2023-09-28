import { IWalletRepository } from "../domain/interfaces/wallet_repository.interface";
import { InsufficientBalance, IWallet, logger } from "../../index";

export class ValidateBalance {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async run(
    clientId: string,
    amount: number,
    assetId: string,
  ): Promise<number> {
    logger.info(`Validando saldos ${clientId} ${assetId}`);
    const wallet: IWallet =
      await this.walletRepository.findWalletsByClientIdAndAssetId(
        clientId,
        assetId,
      );

    logger.info(
      `[TRANSFER] Saldos disponible ${wallet.getBalanceAvailable()} monto de la transaccion ${amount}`,
    );

    if (wallet.getBalanceAvailable() < amount) {
      throw new InsufficientBalance();
    }

    return wallet.getBalanceAvailable();
  }
}
