import { ReferredStatus } from "../enums/referred_status.enum";

export type ReferredDTO = {
  id?: string;
  taxId: string;
  name: string;
  email: string;
  feeSwap: number; // es lo que es aliado se gana por cada exchange
  status: ReferredStatus;
  referredByClientId: string;
  clientId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
