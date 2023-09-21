import { BusinessOpportunityStatus } from "../enums/business_opportunity_status.enum";

export type BusinessOpportunityDTO = {
  id?: string;
  taxId: string;
  name: string;
  email: string;
  feeSwap: number; // es lo que es aliado se gana por cada exchange
  status: BusinessOpportunityStatus;
  referredByClientId: string;
  clientId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
