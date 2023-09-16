import { InstructionDepositFiat } from "../types/instruction_deposit_fiat.type";
import { IClient } from "../../../client";

export interface IBankingRepository {
  saveInternalTransfer(
    amount: number,
    clientDestination: string,
    originClient: string,
    reference: string,
  ): Promise<string>;

  saveExternalTransfer(
    originClient: string,
    amount: number,
    beneficiaryId: string,
    reference: string,
    feeWire?: number,
  ): Promise<string>;
}
