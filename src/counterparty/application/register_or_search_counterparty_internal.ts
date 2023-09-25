import {
  InstructionDepositCrypto,
  IWallet,
  IWalletRepository,
  OriginWallet,
  WalletNotFound,
} from "../../wallet";
import { ICounterpartyRepository } from "../domain/interfaces/counterparty_repository.interface";
import { Counterparty } from "../domain/counterparty.abstract";
import { IClient } from "../../client";
import { Asset, CounterpartyAsset, WalletInformationDTO } from "../../asset";
import { RelationshipConsumer } from "../domain/enums/relationship_consumer.enum";
import { CounterpartyBank, InstructionDepositFiat } from "../../banking";
import { CounterpartyType } from "../domain/enums/counterparty_type.enum";

export class RegisterOrSearchCounterpartyInternal {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly counterpartyRepository: ICounterpartyRepository,
  ) {}

  async run(
    clientOrigin: IClient,
    clientDestination: IClient,
    asset: Asset,
  ): Promise<Counterparty> {
    let counterparty: Counterparty =
      await this.counterpartyRepository.findByCounterpartyIdAndAssetId(
        clientDestination.getClientId(),
        asset.getAssetId(),
      );
    if (counterparty) {
      return counterparty;
    }

    const wallet: IWallet = await this.searchWallet(
      asset.getAssetId(),
      clientDestination,
    );

    if (asset.getAssetCode() !== "USD") {
      counterparty = CounterpartyAsset.newCounterparty(
        clientDestination.getClientId(),
        clientOrigin,
        clientDestination.getName(),
        clientDestination.getAddress().country,
        {
          assetId: wallet.getAsset().getAssetId(),
          address: (
            wallet.getInstructionForDeposit() as InstructionDepositCrypto
          ).address,
          relationshipConsumer: RelationshipConsumer.FRIEND,
          originWallet: OriginWallet.OTHER,
        } as WalletInformationDTO,
        true,
      );
    } else {
      const instruction: InstructionDepositFiat =
        wallet.getInstructionForDeposit() as InstructionDepositFiat;
      counterparty = CounterpartyBank.newCounterparty(
        {
          accountId: clientDestination.getIDNumber(),
          clientId: clientDestination.getClientId(),
          counterpartyId: clientDestination.getClientId(),
          counterpartyType: CounterpartyType.FIAT,
          swiftCode: "SWIFT INTERNAL",
          informationBank: {
            address: undefined,
            bankName: instruction.WIRE.bankName,
            networkBank: undefined,
          },
          informationOwner: {
            address: clientDestination.getAddress(),
            name: clientDestination.getName(),
          },
          id: instruction.id,
          assetId: wallet.getAsset().getAssetId(),
          accountNumber: instruction.WIRE.accountNumber,
        },
        true,
      );
    }

    await this.counterpartyRepository.upsert(counterparty);

    return counterparty;
  }

  private async searchWallet(
    assetId: string,
    clientDestination: IClient,
  ): Promise<IWallet> {
    const wallet: IWallet =
      await this.walletRepository.findWalletsByClientIdAndAssetId(
        clientDestination.getClientId(),
        assetId,
      );

    if (!wallet) {
      throw new WalletNotFound();
    }

    return wallet;
  }
}
