import { BusinessAllieStatus } from "../enums/business_allie_status.enum";
import { FeeLimitsType } from "../type/fee_limits.type";
import { DiffusionChannels } from "../enums/diffussion_channels.enum";
import { Referred } from "../referred";

export interface IBusinessAllie {
  setReferrals(referrals: Referred[]): void;

  updateStatus(status: BusinessAllieStatus): void;

  updateFeeLimits(feeLimits: FeeLimitsType): void;

  updateLink(link: string): void;

  updateDiffusionChanel(diffusionChanel: DiffusionChannels): void;

  getFeeLimits(): FeeLimitsType;
}
