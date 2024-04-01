import { ExchangeStatus } from "../enums/exchange_status.enum";
import { ExchangeMarketActionType } from "../enums/exchange_market_action.enum";

export type ExchangeRequestResponse = {
  id?: string;
  status: ExchangeStatus;
  createdAt: Date;
  exchangeType: string;
  action: ExchangeMarketActionType;
  sourceDetails: {
    sourceAccountId: string;
    assetTypeId: string;
    amountToDebit: number;
  };
  destinationDetails: {
    destinationAccountId: string;
    assetTypeId: string;
    amountToCredit: number;
  };
};
