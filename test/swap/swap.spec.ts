import {
  AmountValueObject,
  BusinessAllieMongoRepository,
  Exchange,
  ExchangeMarketActionType,
  ExchangeMarketPayload,
  ExchangeMongoRepository,
  Referred,
  StringValueObject,
  WalletMongoRepository,
} from "../../src";
import { v4 } from "uuid";

describe("Swap", () => {
  it("should return all exchanges by client id", async () => {
    const clientId = "FSilva187263254";
    const page = 1;
    const perPage = 10;

    const findExchangesByClientId =
      await ExchangeMongoRepository.instance().getExchangesByClientId(
        clientId,
        page,
        perPage,
      );
  });

  it("should create exchange between USD and ETH", async () => {
    const exchangeRequest = {
      clientId: "FSilva187263254",
      sourceAssetId: "FIAT_TESTNET_USD",
      destinationAssetId: "ETHEREUM_GOERLI_ETH",
      amount: 250,
    };

    const sourceWallet =
      await WalletMongoRepository.instance().findWalletsByClientIdAndAssetId(
        exchangeRequest.clientId,
        exchangeRequest.sourceAssetId,
      );

    const destinationWallet =
      await WalletMongoRepository.instance().findWalletsByClientIdAndAssetId(
        exchangeRequest.clientId,
        exchangeRequest.destinationAssetId,
      );

    const exchangePayload: ExchangeMarketPayload = {
      sourceWallet: sourceWallet,
      destinationWallet: destinationWallet,
      amount: exchangeRequest.amount,
      action: ExchangeMarketActionType.FIX_SOURCE,
      description: `Exchange ${
        exchangeRequest.amount
      } ${sourceWallet.getAsset()} to ${destinationWallet.getAsset()}`,
    };

    const opportunity: Referred =
      await BusinessAllieMongoRepository.instance().getOpportunityByClientId(
        exchangeRequest.clientId,
      );

    const exchange: Exchange = Exchange.newExchange(
      v4(),
      {
        assetCode: StringValueObject.create(exchangeRequest.sourceAssetId),
        wallet: exchangePayload.sourceWallet,
        amountDebit: AmountValueObject.create(exchangePayload.amount),
      },
      {
        assetCode: StringValueObject.create(exchangeRequest.destinationAssetId),
        wallet: exchangePayload.destinationWallet,
        amountCredit: AmountValueObject.create(0.05346),
      },
      opportunity,
    );

    expect(exchange.getFeeNoba()).toBe(2.475);
    expect(exchange.getTotalAmount()).toBe(
      Number(exchangeRequest.amount) + Number(exchange.getFeeNoba()),
    );
  });

  it("should create exchange between ETH and USD", async () => {
    const exchangeRequest = {
      clientId: "FSilva187263254",
      destinationAssetId: "FIAT_TESTNET_USD",
      sourceAssetId: "ETHEREUM_GOERLI_ETH",
      amount: 0.06547,
    };

    const sourceWallet =
      await WalletMongoRepository.instance().findWalletsByClientIdAndAssetId(
        exchangeRequest.clientId,
        exchangeRequest.sourceAssetId,
      );

    const destinationWallet =
      await WalletMongoRepository.instance().findWalletsByClientIdAndAssetId(
        exchangeRequest.clientId,
        exchangeRequest.destinationAssetId,
      );

    const exchangePayload: ExchangeMarketPayload = {
      sourceWallet: sourceWallet,
      destinationWallet: destinationWallet,
      amount: exchangeRequest.amount,
      action: ExchangeMarketActionType.FIX_SOURCE,
      description: `Exchange ${
        exchangeRequest.amount
      } ${sourceWallet.getAsset()} to ${destinationWallet.getAsset()}`,
    };

    const opportunity: Referred =
      await BusinessAllieMongoRepository.instance().getOpportunityByClientId(
        exchangeRequest.clientId,
      );

    const exchange: Exchange = Exchange.newExchange(
      v4(),
      {
        assetCode: StringValueObject.create(exchangeRequest.sourceAssetId),
        wallet: exchangePayload.sourceWallet,
        amountDebit: AmountValueObject.create(exchangePayload.amount),
      },
      {
        assetCode: StringValueObject.create(exchangeRequest.destinationAssetId),
        wallet: exchangePayload.destinationWallet,
        amountCredit: AmountValueObject.create(456),
      },
      opportunity,
    );

    console.log(exchange.toPrimitives());
  });

  it("should paginate exchanges by client id", async () => {
    const clientId = "MSerrano181263254";
    const page = 1;
    const perPage = 20;

    const findExchangesByClientId =
      await ExchangeMongoRepository.instance().getExchangesByClientId(
        clientId,
        page,
        perPage,
      );
    console.log(findExchangesByClientId);

    expect(findExchangesByClientId?.results.length).toBe(20);
  });
});
