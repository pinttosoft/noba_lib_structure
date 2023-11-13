import { IBlockchainService } from "../../blockchain";
import { IBankingService } from "../../banking";
import { IWalletRepository } from "../domain/interfaces/wallet_repository.interface";
import { IWallet } from "../domain/interfaces/wallet.interface";
import { WalletNotFound } from "../domain/exceptions/wallet_not_found";

export class UpdateBalanceWallet {
  constructor(
    private readonly service: IBlockchainService | IBankingService,
    private readonly walletRepository: IWalletRepository,
  ) {}

  async run(walletId: string): Promise<void> {
    console.log(`Iniciando actualizacion de balance ${walletId}`);

    const wallet: IWallet =
      await this.walletRepository.findByWalletId(walletId);
    if (!wallet) {
      console.log(`Wallet no existe`);
      throw new WalletNotFound();
    }

    await this.updateBalance(wallet);
  }

  async updateBalance(wallet: IWallet): Promise<void> {
    const balance = await this.service.searchBalanceWallet(
      wallet.getInstructionForDeposit().id,
    );
    console.log(`Balance recuperado ${JSON.stringify(balance)}`);

    console.log(`wallet ${JSON.stringify(wallet)}`);

    wallet.setNewBalance(
      balance.available_balance,
      Number(balance.current_balance) - Number(balance.available_balance),
    );

    await this.walletRepository.updateBalance(wallet);
    console.log("Actualizacion de balance finalizado");
  }
}
