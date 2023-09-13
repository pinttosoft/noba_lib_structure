import { ExchangeMarketPayload } from "../types/exchange_market_payload.type";
import { ExchangeRequestResponse } from "../types/exchange_request_response.type";

export interface ISwapIntegratorService {
  createExchange(
    exchangePayload: ExchangeMarketPayload,
  ): Promise<ExchangeRequestResponse>;

  acceptExchange(exchangeId: string): Promise<ExchangeRequestResponse>;

  getExchange(exchangeId: string): Promise<ExchangeRequestResponse>;
}
