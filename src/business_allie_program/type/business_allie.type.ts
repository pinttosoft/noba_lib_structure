import { BusinessAllieStatus } from "../enums/business_allie_status.enum";
import { ReferredDTO } from "./referred.type";
import { BusinessAllieType } from "../enums/business_allie_type.enum";
import { DiffussionChannels } from "../enums/diffussion_channels.enum";

export type BusinessAllieDTO = {
  id?: string;
  clientId?: string;
  name: string;
  email: string;
  referredBy?: string;
  diffusionChanel?: DiffussionChannels;
  link?: string;
  referrals?: ReferredDTO[];
  status: BusinessAllieStatus;
  type: BusinessAllieType;
  createdAt: Date;
  updatedAt?: Date;
};
