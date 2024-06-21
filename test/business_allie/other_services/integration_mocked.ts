import {
  Exchange,
  ExchangeMarketPayload,
  ExchangeRequestResponse,
  IExchangeIntegratorService,
} from "../../../src";

export class IntegrationMocked implements IExchangeIntegratorService {
  acceptExchange(exchange: Exchange): Promise<ExchangeRequestResponse> {
    return Promise.resolve(undefined);
  }

  async createExchange(
    exchangePayload: ExchangeMarketPayload,
  ): Promise<ExchangeRequestResponse> {
    let response: ExchangeRequestResponse;
    if (exchangePayload.sourceWallet.getAsset().getAssetCode() === "USD") {
      response = {
        id: "some response id",
        action: undefined,
        createdAt: undefined,
        destination_details: {
          amount_to_credit: 0.00154656,
          asset_type_id: "",
          destination_account_id: "",
        },
        exchange_type: "",
        source_details: {
          amount_to_debit: 100,
          asset_type_id: "",
          source_account_id: "",
        },
        status: undefined,
      };

      return Promise.resolve(response);
    }

    response = {
      id: "some response id",
      action: undefined,
      createdAt: undefined,
      destination_details: {
        amount_to_credit: 200,
        asset_type_id: "",
        destination_account_id: "",
      },
      exchange_type: "",
      source_details: {
        amount_to_debit: 0.003,
        asset_type_id: "",
        source_account_id: "",
      },
      status: undefined,
    };

    return Promise.resolve(response);
  }

  searchBalanceWallet(
    walletId: string,
  ): Promise<{ current_balance: number; available_balance: number }> {
    return Promise.resolve({ available_balance: 0, current_balance: 0 });
  }

  searchExchangeData(exchangeId: string): Promise<ExchangeRequestResponse> {
    return Promise.resolve(undefined);
  }
}
