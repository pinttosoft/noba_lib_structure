import { InstructionDepositFiat } from "../types/instruction_deposit_fiat.type";
import { IClient } from "../../../client";
import { CounterpartyBank } from "../counterparty_bank";

export interface IBankingService {
  searchBankInstructionForDeposit(
    client: IClient,
    assetId: string,
  ): Promise<InstructionDepositFiat>;

  registerCounterpartyBank(counterparty: CounterpartyBank): Promise<void>;
}
