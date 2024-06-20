import { BusinessAllieStatus } from "../enums/business_allie_status.enum";
import { FeeLimitsType } from "../type/fee_limits.type";
import { DiffusionChannels } from "../enums/diffussion_channels.enum";
import { ReferredDTO } from "../type/referred.type";

export interface IBusinessAllie {
  setReferrals(referrals: ReferredDTO[]): void;

  updateStatus(status: BusinessAllieStatus): void;

  updateFeeLimits(feeLimits: FeeLimitsType): void;

  updateLink(link: string): void;

  updateDiffusionChanel(diffusionChanel: DiffusionChannels): void;
}
