import { ExchangeStatus } from "../enums/exchange_status.enum";
import { ExchangeMarketActionType } from "../enums/exchange_market_action.enum";

export type ExchangeRequestResponse = {
  id: string;
  status: ExchangeStatus;
  createdAt: Date;
  exchange_type: string;
  action: ExchangeMarketActionType;
  source_details: {
    source_account_id: string;
    asset_type_id: string;
    amount_to_debit: number;
  };
  destination_details: {
    destination_account_id: string;
    asset_type_id: string;
    amount_to_credit: number;
  };
};
