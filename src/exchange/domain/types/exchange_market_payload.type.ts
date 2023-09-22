import { ExchangeMarketActionType } from "../enums/exchange_market_action.enum";
import { IWallet } from "../../../wallet";

export type ExchangeMarketPayload = {
  sourceWallet: IWallet;
  destinationWallet: IWallet;
  amount: number;
  description: string;
  action?: ExchangeMarketActionType;
};
