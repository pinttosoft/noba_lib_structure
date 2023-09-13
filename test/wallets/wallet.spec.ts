import {
  Asset,
  AssetMongoRepository,
  ClientMongoRepository,
  IClient,
  InstructionDepositCrypto,
  IWallet,
  WalletFactory,
  WalletMongoRepository,
  WalletType,
} from "../../src";
import * as console from "console";
import { v4 } from "uuid";

describe("Wallet", () => {
  const clientId = "FSilva187263254";

  it("should create empty crypto wallet", async () => {
    const asset: Asset =
      await AssetMongoRepository.instance().findAssetByCode("BTC");

    const client: IClient =
      await ClientMongoRepository.instance().findByClientId(clientId);

    const wallet: IWallet = WalletFactory.createNewWallet(
      asset,
      client,
      WalletType.CRYPTO,
    );

    await WalletMongoRepository.instance().upsert(wallet);
  });

  it("should add new instruction for deposit", async () => {
    const wallet =
      await WalletMongoRepository.instance().findWalletsByClientIdAndAssetId(
        clientId,
        "BITCOIN_TESTNET_BTC",
      );

    wallet.addNewInstructionForDeposit({
      id: v4(),
      label: "label",
      qr: "qr",
      address: "address",
      balance: 0,
      lockedBalance: 0,
    } as InstructionDepositCrypto);

    await WalletMongoRepository.instance().addNewInstructionForDeposit(wallet);

    console.log(wallet.toPrimitives());
  });
});
