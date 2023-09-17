import { ExchangeMarketPayload } from "../types/exchange_market_payload.type";
import { Exchange } from "../exchange";

export interface IExchangeIntegratorService {
  createExchange(exchangePayload: ExchangeMarketPayload): Promise<Exchange>;

  acceptExchange(exchange: Exchange): Promise<Exchange>;
}
