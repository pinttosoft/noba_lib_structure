import { InstructionDepositFiat } from "../types/instruction_deposit_fiat.type";
import { Client } from "../../../client";

export interface IBankingRepository {
  findBankDataForDeposit(
    client: Client,
  ): Promise<InstructionDepositFiat | undefined>;
}
