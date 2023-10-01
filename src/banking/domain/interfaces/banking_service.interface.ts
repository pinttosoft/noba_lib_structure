import { InstructionDepositFiat } from "../types/instruction_deposit_fiat.type";
import { IClient } from "../../../client";
import { CounterpartyBank } from "../counterparty_bank";
import { InformationBankDTO } from "../types/information_bank.type";
import { Address } from "../../../shared";
import { DepositInformation } from "../../../shared/domain/types/deposit_information.type";

export interface IBankingService {
  searchDepositInformation(
    instructionDepositId: string,
    depositId: string,
  ): Promise<DepositInformation>;

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

  internalTransfer(
    sourceWalletId: string,
    destinationWalletId: string,
    amount: number,
    description?: string,
  ): Promise<string>;

  makeWithdrawal(
    sourceWalletId: string,
    amount: number,
    counterparty: CounterpartyBank,
    description?: string,
  ): Promise<string>;

  searchBalanceWallet(walletId: string): Promise<{
    current_balance: number;
    available_balance: number;
  }>;
}
