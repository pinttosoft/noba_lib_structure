import { IWalletRepository } from "../domain/interfaces/wallet_repository.interface";
import { InsufficientBalance, IWallet } from "../../index";

export class ValidateBalance {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async run(
    clientId: string,
    amount: number,
    assetId: string,
    fee: number = 0,
  ): Promise<number> {
    console.log(`Validando saldos ${clientId} ${assetId}`);
    const wallet: IWallet =
      await this.walletRepository.findWalletsByClientIdAndAssetId(
        clientId,
        assetId,
      );

    const totalAmount = Number(amount) + Number(fee);
    console.log(
      `Saldos disponible ${wallet.getBalanceAvailable()} monto de la transaccion ${totalAmount}`,
    );

    if (wallet.getBalanceAvailable() < totalAmount) {
      throw new InsufficientBalance();
    }

    return wallet.getBalanceAvailable();
  }
}
