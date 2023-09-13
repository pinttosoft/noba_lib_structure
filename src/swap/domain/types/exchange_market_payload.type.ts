import { ExchangeMarketActionType } from "../enums/exchange_market_actio.enum";

export type ExchangeMarketPayload = {
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    action?: ExchangeMarketActionType;
    description: string;
  };