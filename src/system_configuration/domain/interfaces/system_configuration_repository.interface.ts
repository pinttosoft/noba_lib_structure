import { FeeSwapForProgramReferrals } from "../fee_swap_for_program_referrals";
import { FeeSwap } from "../fee_swap";
import { FeeWire } from "../fee_wire";
import { FeeACHPanama } from "../feeACHPanama";
import { FeeAchUsd } from "../fee_ach_usd";
import { CommissionForRechargingCard } from "../commission_for_recharging_card";

export interface ISystemConfigurationRepository {
  getIntegratorSwapFee(): Promise<FeeSwap>;

  getNobaFee(): Promise<FeeSwap>;

  getDefaultFeeWire(): Promise<FeeWire>;

  getDefaultFeeSwap(): Promise<FeeSwap>;

  getFeeSwapProgramReferrals(): Promise<FeeSwapForProgramReferrals>;

  getFeeNobaForSwapOfBusinessOpportunities(): Promise<number>;

  getDefaultFeeACHPAB(): Promise<FeeACHPanama>;

  getDefaultFeeRechargingCard(): Promise<CommissionForRechargingCard>;

  getDefaultFeeAchUsd(): Promise<FeeAchUsd>;
}
