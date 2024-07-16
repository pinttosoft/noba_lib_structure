import {
  AmountValueObject,
  BusinessAllieMongoRepository,
  Exchange,
  ExchangeMarketActionType,
  ExchangeMarketPayload,
  StringValueObject,
  Wallet,
  WalletMongoRepository,
} from "../../src";
import { v4 } from "uuid";

describe("Exchange", () => {
  it("should create exchange USD -> CRYPTO", async () => {
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

  it("should create exchange CRYTPO -> USD", async () => {
    const exchangeRequest = {
      clientId: "FSilva187263254",
      amount: 2400,
      sourceWalletId: "USDC",
      destinationWalletId: "USD",
      description: "Swap 2400 [object Object] --> USD",
    };
    const sourceWallet = await WalletMongoRepository.instance().findByWalletId(
      "f50e72c8-1bc5-4944-8754-e6d077ffa76a",
    );

    const destinationWallet =
      await WalletMongoRepository.instance().findByWalletId(
        "458b6eb2-e311-4062-9fe0-3b9c4e60bdc5",
      );

    const opportunity =
      await BusinessAllieMongoRepository.instance().getOpportunityByClientId(
        exchangeRequest.clientId,
      );

    const exchangeResponse = {
      id: "005c1b64-0528-4cf8-9da8-0362a2515b4a",
      status: "REQUESTED",
      created_timestamp: "2024-01-09T12:14:15.249641-05:00",
      action: "FIX_SOURCE",
      source_details: {
        source_account_id:
          "DAGUILERA24785658-PRINCIPAL-WALLET-USDT-ETHEREUM_MAINNET_USDT",
        asset_type_id: "ETHEREUM_MAINNET_USDT",
        amount_to_debit: 2400,
      },
      destination_details: {
        destination_account_id: "DAGUILERA24785658-USD-FIAT_MAINNET_USD",
        asset_type_id: "FIAT_MAINNET_USD",
        amount_to_credit: 2395.7,
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

  it("USD -> USDT calculates fee correctly when operating fee is greater than fee client percentage", async () => {
    process.env.BASE_SWAP_FEE_PERCENT = "0.3";

    const sourceWallet = {
      getAsset: jest.fn(() => ({
        getAssetCode: jest.fn(() => "USD"),
      })),
      getClient: jest.fn(() => ({
        getFeeSwap: jest.fn(() => ({
          getFeeForSell: jest.fn().mockReturnValue(0.3),
          getFeeForBuy: jest.fn().mockReturnValue(0.3),
        })),
        getClientId: jest.fn().mockReturnValue("FSilva187263254"),
      })),
      getClientId: jest.fn(() => "FSilva187263254"),
      walletId: "458b6eb2-e311-4062-9fe0-3b9c4e60bdc5",
      getWalletId: jest
        .fn()
        .mockReturnValue("458b6eb2-e311-4062-9fe0-3b9c4e60bdc5"),
    };

    const destinationWallet = {
      getAsset: jest.fn(() => ({
        getAssetCode: jest.fn(() => "USDT"),
      })),
      walletId: "f50e72c8-1bc5-4944-8754-e6d077ffa76a",
      getWalletId: jest.fn(() => "f50e72c8-1bc5-4944-8754-e6d077ffa76a"),
      getClientId: jest.fn().mockReturnValue("FSilva187263254"),
      getClient: jest.fn(() => ({
        getFeeSwap: jest.fn(() => ({
          getFeeForSell: jest.fn().mockReturnValue(0.3),
          getFeeForBuy: jest.fn().mockReturnValue(0.3),
        })),
      })),
    };

    const exchange = jest.mocked(
      Exchange.newExchange(
        v4(),
        {
          assetCode: StringValueObject.create("USD"),
          wallet: sourceWallet as unknown as Wallet,
          amountDebit: AmountValueObject.create(1510),
        },
        {
          assetCode: StringValueObject.create("USDT"),
          wallet: destinationWallet as unknown as Wallet,
          amountCredit: AmountValueObject.create(1508.5),
        },
      ),
      { shallow: false },
    );

    console.log("exchange.calculateFee()", exchange.calculateFee());
  });
  it("USDT -> USD calculates fee correctly when operating fee is less than fee percentage", async () => {
    process.env.BASE_SWAP_FEE_PERCENT = "0.3";

    const sourceWallet = {
      getAsset: jest.fn(() => ({
        getAssetCode: jest.fn(() => "USDT"),
      })),
      getClient: jest.fn(() => ({
        getFeeSwap: jest.fn(() => ({
          getFeeForSell: jest.fn().mockReturnValue(1),
          getFeeForBuy: jest.fn().mockReturnValue(1),
        })),
        getClientId: jest.fn().mockReturnValue("FSilva187263254"),
      })),
      getClientId: jest.fn(() => "FSilva187263254"),
      walletId: "458b6eb2-e311-4062-9fe0-3b9c4e60bdc5",
      getWalletId: jest
        .fn()
        .mockReturnValue("458b6eb2-e311-4062-9fe0-3b9c4e60bdc5"),
    };

    const destinationWallet = {
      getAsset: jest.fn(() => ({
        getAssetCode: jest.fn(() => "USD"),
      })),
      walletId: "f50e72c8-1bc5-4944-8754-e6d077ffa76a",
      getWalletId: jest.fn(() => "f50e72c8-1bc5-4944-8754-e6d077ffa76a"),
      getClientId: jest.fn().mockReturnValue("FSilva187263254"),
      getClient: jest.fn(() => ({
        getFeeSwap: jest.fn(() => ({
          getFeeForSell: jest.fn().mockReturnValue(1),
          getFeeForBuy: jest.fn().mockReturnValue(1),
        })),
      })),
    };

    const exchange = jest.mocked(
      Exchange.newExchange(
        v4(),
        {
          assetCode: StringValueObject.create("USDT"),
          wallet: sourceWallet as unknown as Wallet,
          amountDebit: AmountValueObject.create(100),
        },
        {
          assetCode: StringValueObject.create("USD"),
          wallet: destinationWallet as unknown as Wallet,
          amountCredit: AmountValueObject.create(99.43),
        },
      ),
      { shallow: false },
    );
  });
});
