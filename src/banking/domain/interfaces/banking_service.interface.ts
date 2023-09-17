import { InstructionDepositFiat } from "../types/instruction_deposit_fiat.type";
import { IClient } from "../../../client";
import { CounterpartyBank } from "../counterparty_bank";
import { InformationBankDTO } from "../types/information_bank.type";
import { Address } from "../../../shared";

export interface IBankingService {
  searchBankInstructionForDeposit(
    client: IClient,
    assetId: string,
  ): Promise<InstructionDepositFiat>;

  registerCounterpartyBank(
    client: IClient,
    informationOwner: {
      name: string;
      address: Address;
    },
    assetId: string,
    informationBank: InformationBankDTO,
  ): Promise<CounterpartyBank>;
}
