import {
  AssetMongoRepository,
  ClientMongoRepository,
  InstructionDepositFiat,
  IWallet,
  logger,
  WalletFactory,
  WalletMongoRepository,
  WalletType,
} from "../../src";

describe("Wallet", () => {
  const clientId = "ABejarano187263254";

  // it("should create empty crypto wallet", async () => {
  //   const asset: Asset =
  //     await AssetMongoRepository.instance().findAssetByCode("BTC");
  //
  //   const client: IClient =
  //     await ClientMongoRepository.instance().findByClientId(clientId);
  //
  //   const wallet: IWallet = WalletFactory.createNewWallet(
  //     asset,
  //     client,
  //     WalletType.CRYPTO,
  //   );
  //
  //   await WalletMongoRepository.instance().upsert(wallet);
  // });

  // it("should add new instruction for deposit", async () => {
  //   const wallet =
  //     await WalletMongoRepository.instance().findWalletsByClientIdAndAssetId(
  //       clientId,
  //       "BITCOIN_TESTNET_BTC",
  //     );
  //
  //   wallet.addNewInstructionForDeposit({
  //     id: v4(),
  //     label: "label",
  //     qr: "qr",
  //     address: "address",
  //     balance: 0,
  //     lockedBalance: 0,
  //   } as InstructionDepositCrypto);
  //
  //   await WalletMongoRepository.instance().addNewInstructionForDeposit(wallet);
  //
  //   console.log(wallet.toPrimitives());
  // });
  //
  // it("should paginate payment address by clientId and assetId", async () => {
  //   const paymentAddress =
  //     await WalletMongoRepository.instance().findPaymentAddressesByClientIdAndByAssetId(
  //       clientId,
  //       "BITCOIN_TESTNET_BTC",
  //       1,
  //       10,
  //     );
  //
  //   console.log(JSON.stringify(paymentAddress));
  // });

  it("should paginate payment address by clientId", async () => {
    logger.info("should paginate payment address by clientId");
    const paymentAddress =
      await WalletMongoRepository.instance().findPaymentAddressesByClientIdAndByAssetId(
        clientId,
        undefined,
      );
  });

  it("should calculate locked balance", async () => {
    const wallet: IWallet =
      await WalletMongoRepository.instance().findWalletsByClientIdAndAssetId(
        "ABejarano187263254",
        "FIAT_TESTNET_USD",
      );

    console.log(wallet.getBalanceAvailable());
  });

  it("should create ACH_PAB wallet", async () => {
    const clientId = "MSerrano181263254";
    const assetId = "FIAT_TESTNET_PAB";
    const walletRepo = WalletMongoRepository.instance();

    const assetRepo = AssetMongoRepository.instance();
    const pab = await assetRepo.findAssetByCode("PAB");
    console.log("pab", pab);

    const client =
      await ClientMongoRepository.instance().findByClientId(clientId);

    const instructionForDeposits: InstructionDepositFiat = {
      id: "",
      label: "",
      ACH_PAB: {
        accountDestinationNumber: "",
        memo: "",
        accountRoutingNumber: "",
        holderName: client.getName(),
        bankName: "",
      },
    };

    const walletPayload: IWallet = WalletFactory.createNewWallet(
      pab,
      client,
      WalletType.FIAT,
      instructionForDeposits,
    );

    await walletRepo.insert(walletPayload);

    const res = await walletRepo.findPaymentAddressesByClientIdAndByAssetId(
      clientId,
      assetId,
    );

    console.log("res", res);

    //console.log(wallet.getBalanceAvailable());
    //console.log("walletPayload", walletPayload);
  });
});
