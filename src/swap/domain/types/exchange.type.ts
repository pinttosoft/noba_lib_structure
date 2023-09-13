import { ExchangeRequestResponse } from "./exchange_request_response.type";

export type ExchangeType =
  | ExchangeRequestResponse
  | {
      clientId: string;
      acceptedAt?: Date;

      baseAmount?: number;
      feeAmount?: number;
      totalAmount?: number;

      feeNoba: number;
      feeIntegrator: number;
    };
