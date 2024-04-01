import { ExchangeMarketPayload } from "../types/exchange_market_payload.type";
import { Exchange } from "../exchange";
import { ExchangeRequestResponse } from "../types/ExchangeResponse.type";

export interface IExchangeIntegratorService {
  createExchange(
    exchangePayload: ExchangeMarketPayload,
  ): Promise<ExchangeRequestResponse>;

  acceptExchange(exchange: Exchange): Promise<ExchangeRequestResponse>;

  searchExchangeData(exchangeId: string): Promise<ExchangeRequestResponse>;

  searchBalanceWallet(walletId: string): Promise<{
    current_balance: number;
    available_balance: number;
  }>;
}
