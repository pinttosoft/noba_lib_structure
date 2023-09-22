export type ExchangeMarketRequest = {
  clientId: string;
  sourceWalletId: string;
  destinationWalletId: string;
  amount: number;
  description: string;
};