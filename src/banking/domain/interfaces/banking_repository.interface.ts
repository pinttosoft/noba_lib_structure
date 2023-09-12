import { InstructionDepositFiat } from "../types/instruction_deposit_fiat.type";
import { IClient } from "../../../client";

export interface IBankingRepository {
  findBankDataForDeposit(
    client: IClient,
  ): Promise<InstructionDepositFiat | undefined>;
}
