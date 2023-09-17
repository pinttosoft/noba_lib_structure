import { Paginate } from "../../../shared";
import { Exchange } from "../exchange";

export interface IExchangeRepository {
  // findQuoteById(quoteId: string): Promise<QuoteType | undefined>;
  getExchangeById(id: string): Promise<Exchange | undefined>;
  // saveQuote(quote: QuoteType): Promise<void>;
  upsert(exchange: Exchange): Promise<void>;
  // updateQuote(quote: QuoteType): Promise<void>;
  //
  // getQuotesByAccountId(
  //   accountId: string,
  //   initDoc?: string
  // ): Promise<Paginate<QuoteType>>;
  getExchangesByClientId(
    clientId: string,
    page: number,
    perPage: number,
  ): Promise<Paginate<Exchange> | undefined>;
  // lookUpSwapFeeOfAccount(accountId: string): Promise<FeeContent | null>;
}
