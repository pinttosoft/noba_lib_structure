import { BusinessAllieStatus } from "../enums/business_allie_status.enum";
import { ReferredDTO } from "./referred.type";
import { BusinessAllieType } from "../enums/business_allie_type.enum";
import { DiffusionChannels } from "../enums/diffussion_channels.enum";
import { FeeLimitsType } from "./fee_limits.type";
import { IClient } from "../../client";

export type BusinessAllieDTO = {
  id?: string;
  clientId?: string;
  name: string;
  email: string;
  referrals?: ReferredDTO[];
  status: BusinessAllieStatus;
  type: BusinessAllieType;
  createdAt: Date;
  diffusionChanel?: DiffusionChannels;
  link?: string;
  referredBy?: string;
  updatedAt?: Date;
  feeLimits?: FeeLimitsType;
  client?: IClient;
};
