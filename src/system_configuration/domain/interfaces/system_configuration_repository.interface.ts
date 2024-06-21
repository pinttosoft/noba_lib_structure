import { FeeSwapForProgramReferrals } from "../fee_swap_for_program_referrals";
import { FeeSwap } from "../fee_swap";
import { FeeWire } from "../fee_wire";
import { FeeACHPanama } from "../feeACHPanama";
import { CommissionForRechargingCard } from "../commission_for_recharging_card";
import { FeeAchUsd } from "../fee_ach_usd";
import { CommissionForIssuingCard } from "../commission_for_issuing_card";
import { TransactionalProfile } from "../transactional_profile";

export interface ISystemConfigurationRepository {
  getIntegratorSwapFee(): Promise<FeeSwap>;

  getNobaFee(): Promise<FeeSwap>;

  getDefaultFeeWire(): Promise<FeeWire>;

  getDefaultFeeSwap(): Promise<FeeSwap>;

  getFeeSwapProgramReferrals(): Promise<FeeSwapForProgramReferrals>;

  getFeeNobaForSwapOfBusinessOpportunities(): Promise<number>;

  getDefaultFeeACHPAB(): Promise<FeeACHPanama>;

  getDefaultFeeRechargingCard(): Promise<CommissionForRechargingCard>;

  getDefaultTransactionalProfile(type: string): Promise<TransactionalProfile>;

  getDefaultFeeAchUsd(): Promise<FeeAchUsd>;

  getFeeIssuingCard(): Promise<CommissionForIssuingCard>;
}
