import {
  AssetMongoRepository,
  ClientMongoRepository,
  CounterpartyMongoRepository,
  InstructionsAchPabType,
  IWallet,
  logger,
  MakeRequestInternalTransfer,
  WalletFactory,
  WalletMongoRepository,
  WalletType,
  WithdrawalRequestMongoRepository,
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
    const walletRepo = WalletMongoRepository.instance();

    const assetCode = "PAB";
    const assetRepo = AssetMongoRepository.instance();
    const pab = await assetRepo.findAssetByCode(assetCode);
    console.log("pab", pab);

    const client =
      await ClientMongoRepository.instance().findByClientId(clientId);

    const instructionForDeposits: InstructionsAchPabType = {
      id: "",
      label: "",
      accountDestinationNumber: "",
      holderEmail: "",
      holderId: "",
      holderName: client.getName(),
      bankName: "",
      productType: "",
      concept: "",
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
      pab.getAssetId(),
    );

    console.log("res", res);

    //console.log(wallet.getBalanceAvailable());
    //console.log("walletPayload", walletPayload);
  });

  it("Should update ACH PAB balances", async () => {
    const walletRepo = WalletMongoRepository.instance();
    const clientOriginId = "MSerrano181263254";
    const clientDestinationId = "FSilva187263254";

    const asset = await AssetMongoRepository.instance().findAssetByCode("PAB");
    const amount = 1.1;

    const originWallet: IWallet =
      await walletRepo.findWalletsByClientIdAndAssetId(
        clientOriginId,
        asset.getAssetId(),
      );

    console.log(
      "--originWallet",
      originWallet.getBalance(),
      originWallet.getBalanceAvailable(),
      originWallet.getLockedBalance(),
    );

    const destinationWallet: IWallet =
      await walletRepo.findWalletsByClientIdAndAssetId(
        clientDestinationId,
        asset.getAssetId(),
      );

    console.log(
      "--destinationWallet",
      destinationWallet.getBalance(),
      destinationWallet.getBalanceAvailable(),
      destinationWallet.getLockedBalance(),
    );

    const withdrawalId = await new MakeRequestInternalTransfer(
      ClientMongoRepository.instance(),
      WalletMongoRepository.instance(),
      AssetMongoRepository.instance(),
      WithdrawalRequestMongoRepository.instance(),
      CounterpartyMongoRepository.instance(),
    ).run(clientOriginId, clientDestinationId, amount, "PAB", "1st test");

    console.log("===== withdrawalId", withdrawalId);
  });
});

it("Should finish a withdrawal request and create a transaction", async () => {
  const walletRepo = WalletMongoRepository.instance();
  const withdrawalRepo = WithdrawalRequestMongoRepository.instance();
  const clientOriginId = "MSerrano181263254";
  const clientDestinationId = "FSilva187263254";

  const asset = await AssetMongoRepository.instance().findAssetByCode("PAB");
  const withdrawalId = "242cbd3d-8137-49fd-a275-4f4ec3b8bdf9";
  const withdrawal = await withdrawalRepo.findByWithdrawalId(withdrawalId);
  const amount = withdrawal.getAmount();

  const originWallet: IWallet =
    await walletRepo.findWalletsByClientIdAndAssetId(
      clientOriginId,
      asset.getAssetId(),
    );

  const destinationWallet: IWallet =
    await walletRepo.findWalletsByClientIdAndAssetId(
      clientDestinationId,
      asset.getAssetId(),
    );

  await updateACHWallet(originWallet, amount, false);
  await updateACHWallet(destinationWallet, amount, true);
});

const updateACHWallet = async (
  wallet: IWallet,
  amount: number,
  isCredit = true,
) => {
  const walletRepo = WalletMongoRepository.instance();

  if (isCredit) {
    wallet.setNewBalance(
      wallet.getBalanceAvailable() + amount,
      wallet.getLockedBalance(),
    );
  } else {
    wallet.setNewBalance(
      wallet.getBalanceAvailable() - amount,
      (wallet.getLockedBalance() - amount) * -1,
    );
  }

  await walletRepo.updateBalance(wallet);
};
