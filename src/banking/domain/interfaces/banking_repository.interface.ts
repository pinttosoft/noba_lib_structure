import { BankingRails } from "../banking_rails";

export interface IBankingRepository {
  findBankingRailByCountryCode(
    countryCode: string,
  ): Promise<BankingRails | undefined>;

  upsert(bankingRails: BankingRails): Promise<void>;

  fetchAll(): Promise<BankingRails[]>;

  editRail(bankingRail: BankingRails): Promise<void>;

  deleteRail(bankingRail: BankingRails): Promise<void>;
}
