import { InstructionDepositCrypto, WalletType } from "../../wallet";
import { IClient } from "../../client";
import { CounterpartyAsset, WalletInformationDTO } from "../../asset";
import { DepositInformation } from "../../shared";
import { WithdrawalPurpose } from "../../withdrawal";
import { CounterpartyProfileType } from "../../counterparty";

export interface IBlockchainService {
  lookWalletAddress(
    label: string,
    client: IClient,
    assetId: string,
    walletType: WalletType,
  ): Promise<InstructionDepositCrypto>;

  registerCounterpartyAsset(
    client: IClient,
    informationOwner: {
      name: string;
      country: string;
    },
    informationWallet: WalletInformationDTO,
    profileType: CounterpartyProfileType,
  ): Promise<CounterpartyAsset>;

  internalTransfer(
    sourceWalletId: string,
    destinationWalletId: string,
    amount: number,
    description?: string,
  ): Promise<string>;

  makeWithdrawal(
    instructionForDepositId: string,
    amount: number,
    counterparty: CounterpartyAsset,
    description: string,
    purpose: WithdrawalPurpose,
  ): Promise<string>;

  searchBalanceWallet(walletId: string): Promise<{
    current_balance: number;
    available_balance: number;
  }>;

  searchDepositInformation(
    instructionDepositId: string,
    depositId: string,
  ): Promise<DepositInformation>;
}
