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

  createExchange(
    exchangePayload: ExchangeMarketPayload,
  ): Promise<ExchangeRequestResponse> {
    return Promise.resolve(undefined);
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
