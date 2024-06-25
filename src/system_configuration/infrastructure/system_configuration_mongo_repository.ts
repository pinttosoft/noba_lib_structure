import { ISystemConfigurationRepository } from "../domain/interfaces/system_configuration_repository.interface";
import { FeeSwapDTO } from "../domain/types/fee_swap.type";
import { FeeWireDTO } from "../domain/types/fee_wire.type";
import { FeeSwapForProgramReferralsDTO } from "../domain/types/fee_swap_for_program_referrals.type";
import { MongoClientFactory, MongoRepository } from "../../shared";
import { FeeSwap } from "../domain/fee_swap";
import { FeeSwapForProgramReferrals } from "../domain/fee_swap_for_program_referrals";
import { FeeWire } from "../domain/fee_wire";
import { ObjectId } from "mongodb";
import { FeeACHPanama } from "../domain/feeACHPanama";
import { FeeACHPAB } from "../domain/types/fee_ach_pab.type";
import { CommissionForRechargingCard } from "../domain/commission_for_recharging_card";
import { CommissionForIssuingCard } from "../domain/commission_for_issuing_card";
import { FeeAchUsd } from "../domain/fee_ach_usd";
import { TransactionalProfile } from "../domain/transactional_profile";
import { AccountType } from "../../account";

type SystemConfig = {
  _id: ObjectId;
  feeSwap: FeeSwapDTO;
  feeWire: FeeWireDTO;
  feeACHPanama: FeeACHPAB;
  FeeSwapForProgramReferrals: FeeSwapForProgramReferralsDTO;
  feeRechargingCard: CommissionForRechargingCard;
  feeAchUsd: FeeAchUsd;
  feeIssuingCard: {
    issuingVirtual: number;
    issuingPhysical: {
      issuingFee: number;
      deliveryFee: number;
    };
  };
  transactionProfile: TransactionalProfile;
};

export class SystemConfigurationMongoRepository
  extends MongoRepository<any>
  implements ISystemConfigurationRepository
{
  private static _instance: SystemConfigurationMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  static instance(): ISystemConfigurationRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new SystemConfigurationMongoRepository();
    return this._instance;
  }

  collectionName(): string {
    return "system_configuration";
  }

  async getDefaultFeeSwap(): Promise<FeeSwap> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    if (!result) {
    }

    return FeeSwap.fromPrimitives(result.feeSwap);
  }

  async getDefaultFeeWire(): Promise<FeeWire> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    if (!result) {
    }

    return FeeWire.fromPrimitives(result.feeWire);
  }

  async getDefaultFeeACHPAB(): Promise<FeeACHPanama> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    if (!result) {
    }

    return FeeACHPanama.fromPrimitives(result.feeACHPanama);
  }

  async getFeeIssuingCard(): Promise<CommissionForIssuingCard> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    return CommissionForIssuingCard.fromPrimitives(result.feeIssuingCard);
  }

  async getDefaultFeeRechargingCard(): Promise<CommissionForRechargingCard> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    return CommissionForRechargingCard.fromPrimitives(result.feeRechargingCard);
  }

  async getDefaultTransactionalProfile(
    type: AccountType,
  ): Promise<TransactionalProfile> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    return TransactionalProfile.fromPrimitives(
      type === AccountType.COMPANY
        ? result.transactionProfile.company
        : result.transactionProfile.natural_person,
      type,
    );
  }

  getFeeNobaForSwapOfBusinessOpportunities(): Promise<number> {
    return Promise.resolve(0);
  }

  getFeeSwapProgramReferrals(): Promise<FeeSwapForProgramReferrals> {
    return Promise.resolve(undefined);
  }

  getIntegratorSwapFee(): Promise<FeeSwap> {
    return Promise.resolve(undefined);
  }

  getNobaFee(): Promise<FeeSwap> {
    return Promise.resolve(undefined);
  }

  async getDefaultFeeAchUsd(): Promise<FeeAchUsd> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    if (!result) {
      return undefined;
    }

    return FeeAchUsd.fromPrimitives(result.feeAchUsd);
  }
}
