import { IClient } from "../../../client";
import {
  IWallet,
  WalletType,
  Wallet,
  InstructionDepositCrypto,
} from "../../../wallet";
import { GenericException } from "../../../shared";
import { Asset } from "../../../asset";
import { InstructionDepositFiat } from "../../../banking";

export class WalletFactory {
  static createNewWallet(
    asset: Asset,
    client: IClient,
    type: WalletType,
    instructionForDeposit: InstructionDepositCrypto | InstructionDepositFiat,
  ): IWallet {
    const w: Wallet = new Wallet();

    w.setAsset(asset)
      .setInstructionForDeposit(instructionForDeposit)
      .setClient(client)
      .setWalletType(type)
      .build();

    return w;
  }

  static fromPrimitives(
    id: string,
    data: any,
    client: IClient,
    asset: Asset,
  ): IWallet {
    const w: Wallet = new Wallet();

    try {
      w.setId(id)
        .setWalletId(data.walletId)
        .setWalletType(data.walletType)
        .setAsset(asset)
        .setClient(client)
        .setBalance(data.balance)
        .setCreditBalance(data.creditBalance)
        .setInstructionForDeposit(data.instructionForDeposit)
        .setLockedBalance(data.lockedBalance);
    } catch (e) {
      throw new GenericException(e.message);
    }

    return w;
  }
}
