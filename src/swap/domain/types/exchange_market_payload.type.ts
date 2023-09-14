import { ExchangeMarketActionType } from "../enums/exchange_market_action.enum";

export type ExchangeMarketPayload = {
  clientId: string;
  
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  action?: ExchangeMarketActionType;
  description: string;
};
