import { ExchangeMarketPayload } from "../types/exchange_market_payload.type";
import { ExchangeRequestResponse } from "../types/exchange_request_response.type";

// todo remove any and place ExchangeRequestResponse
export interface ISwapIntegratorService {
  createExchange(exchangePayload: ExchangeMarketPayload): Promise<any>;

  acceptExchange(exchangeId: string, maximumSlippage: number): Promise<any>;

  getExchange(exchangeId: string): Promise<any>;
}
