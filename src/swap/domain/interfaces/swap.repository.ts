import { ExchangeType } from "../types/exchange.type";
import { Paginate } from "../../../shared";
import { FeeSwapDTO } from "../../../system_configuration";

export interface ISwapRepository {
  // findQuoteById(quoteId: string): Promise<QuoteType | undefined>;
  getExchangeById(id: string): Promise<ExchangeType | undefined>;
  // saveQuote(quote: QuoteType): Promise<void>;
  saveExchange(exchange: ExchangeType): Promise<void>;
  // updateQuote(quote: QuoteType): Promise<void>;
  updateExchange(exchange: ExchangeType): Promise<void>;
  //
  // getQuotesByAccountId(
  //   accountId: string,
  //   initDoc?: string
  // ): Promise<Paginate<QuoteType>>;
  getExchangesByClientId(
    clientId: string,
    initDoc?: string,
  ): Promise<Paginate<ExchangeType> | undefined>;
  // lookUpSwapFeeOfAccount(accountId: string): Promise<FeeContent | null>;
  getFeeSwapByClientId(clientId: string): Promise<FeeSwapDTO | undefined>;
}
