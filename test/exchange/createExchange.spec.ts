import {
  AmountValueObject,
  BusinessAllieMongoRepository,
  Exchange,
  ExchangeMarketActionType,
  ExchangeMarketPayload,
  StringValueObject,
  WalletMongoRepository,
} from "../../src";

describe("Exchange", () => {
  it("should create exchange", async () => {
    const exchangeRequest = {
      clientId: "FSilva187263254",
      amount: 730,
      description: "Swap 0.568 --> ETH",
      destinationWalletId: "USDC",
      sourceWalletId: "USD",
    };
    const sourceWallet = await WalletMongoRepository.instance().findByWalletId(
      "458b6eb2-e311-4062-9fe0-3b9c4e60bdc5",
    );

    const destinationWallet =
      await WalletMongoRepository.instance().findByWalletId(
        "f50e72c8-1bc5-4944-8754-e6d077ffa76a",
      );

    const opportunity =
      await BusinessAllieMongoRepository.instance().getOpportunityByClientId(
        exchangeRequest.clientId,
      );

    const exchangeResponse = {
      id: "9f0151c6-45ec-4a4a-8ea2-a00ce3413c75",
      status: "REQUESTED",
      created_timestamp: "2023-12-12T10:05:38.659937-05:00",
      action: "FIX_SOURCE",
      source_details: {
        source_account_id: "FSILVA187263254-USD-FIAT_TESTNET_USD",
        asset_type_id: "FIAT_TESTNET_USD",
        amount_to_debit: 730,
      },
      destination_details: {
        destination_account_id:
          "FSILVA187263254-WALLET-TEST-ETHEREUM_GOERLI_USDC",
        asset_type_id: "ETHEREUM_GOERLI_USDC",
        amount_to_credit: 722.772277,
      },
    };

    const exchangePayload: ExchangeMarketPayload = {
      sourceWallet: sourceWallet,
      destinationWallet: destinationWallet,
      amount: exchangeRequest.amount,
      action: ExchangeMarketActionType.FIX_SOURCE,
      description: `Exchange ${
        exchangeRequest.amount
      } ${sourceWallet.getAsset()} to ${destinationWallet.getAsset()}`,
    };

    const exchange = Exchange.newExchange(
      exchangeResponse.id,
      {
        assetCode: StringValueObject.create(exchangeRequest.sourceWalletId),
        wallet: exchangePayload.sourceWallet,
        amountDebit: AmountValueObject.create(exchangePayload.amount),
      },
      {
        assetCode: StringValueObject.create(
          exchangeRequest.destinationWalletId,
        ),
        wallet: exchangePayload.destinationWallet,
        amountCredit: AmountValueObject.create(
          exchangeResponse.destination_details.amount_to_credit,
        ),
      },
      opportunity,
    );

    console.log(exchange);
  });
});
