import { BusinessAllieStatus } from "../enums/business_allie_status.enum";
import { ReferredDTO } from "./business_opportunity.type";
import { BusinessAllieType } from "../enums/business_allie_type.enum";

export type BusinessAllieDTO = {
  id?: string;
  clientId: string;
  name: string;
  email: string;
  referredBy?: string;
  businessOpportunities?: ReferredDTO[];
  status: BusinessAllieStatus;
  type: BusinessAllieType;
  createdAt: Date;
  updatedAt?: Date;
};
