import { ExchangeMarketPayload } from "../types/exchange_market_payload.type";
import { Exchange } from "../exchange";
import { ExchangeRequestResponse } from "../types/exchange_response.type";

export interface IExchangeIntegratorService {
  createExchange(
    exchangePayload: ExchangeMarketPayload,
  ): Promise<ExchangeRequestResponse>;

  acceptExchange(exchange: Exchange): Promise<ExchangeRequestResponse>;

  searchExchangeData(exchangeId: string): Promise<ExchangeRequestResponse>;
}
