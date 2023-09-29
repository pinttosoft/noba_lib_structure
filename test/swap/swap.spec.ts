import {
  AmountValueObject,
  BusinessAllieMongoRepository,
  BusinessOpportunity,
  Exchange,
  ExchangeMarketActionType,
  ExchangeMarketPayload,
  ExchangeMongoRepository,
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
    console.log(findExchangesByClientId);
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

    const opportunity: BusinessOpportunity =
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

    console.log(exchange.toPrimitives());

    expect(exchange.getFeeNoba()).toBe(2.475);
    expect(exchange.getTotalAmount()).toBe(
      Number(exchangeRequest.amount) + Number(exchange.getFeeNoba()),
    );
  });
});
