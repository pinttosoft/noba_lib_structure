import { BusinessAllieStatus } from "../enums/business_allie_status.enum";
import { BusinessOpportunityDTO } from "./business_opportunity.type";

export type BusinessAllieDTO = {
  id?: string;
  accountId: string;
  name: string;
  email: string;
  referredBy?: string;
  businessOpportunities?: BusinessOpportunityDTO[];
  status: BusinessAllieStatus;
  createdAt: Date;
  updatedAt?: Date;
};
