import {
  InstructionDepositCrypto,
  IWallet,
  IWalletRepository,
  OriginWallet,
  WalletNotFound,
  WalletProvider,
} from "../../wallet";
import { ICounterpartyRepository } from "../domain/interfaces/counterparty_repository.interface";
import { Counterparty } from "../domain/counterparty.abstract";
import { IClient } from "../../client";
import {
  Asset,
  AssetClassification,
  CounterpartyAsset,
  WalletInformationDTO,
} from "../../asset";
import { RelationshipConsumer } from "../domain/enums/relationship_consumer.enum";
import {
  CounterpartyAchPab,
  CounterpartyAchPabDtoType,
  CounterpartyBank,
  InstructionDepositFiat,
  InstructionsAchPabType,
} from "../../banking";
import { CounterpartyType } from "../domain/enums/counterparty_type.enum";
import { AccountType, CounterpartyProfileType, logger } from "../../index";
import { CounterpartyStatus } from "../domain/enums/counterparty_status.enum";

export class RegisterOrSearchCounterpartyInternal {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly counterpartyRepository: ICounterpartyRepository,
  ) {}

  async run(
    clientOrigin: IClient,
    clientDestination: IClient,
    asset: Asset,
    walletProvider: WalletProvider,
  ): Promise<Counterparty> {
    let counterparty: Counterparty =
      await this.counterpartyRepository.findMyCounterpartyByAssetId(
        clientOrigin.getClientId(),
        clientDestination.getClientId(),
        asset.getAssetId(),
      );

    if (counterparty) {
      logger.info(
        `Se encontro el counterparty ${counterparty.getCounterpartyId()} para el asset ${counterparty.getAssetId()}`,
      );
      return counterparty;
    }

    const wallet: IWallet = await this.searchWallet(
      asset.getAssetId(),
      clientDestination,
      walletProvider,
    );

    if (asset.getAssetClassification() !== AssetClassification.FIAT) {
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
        clientDestination.getClientType() === AccountType.INDIVIDUAL
          ? CounterpartyProfileType.INDIVIDUAL
          : CounterpartyProfileType.CORPORATION,
        CounterpartyStatus.ACTIVE,
        true,
      );
    }

    if (asset.getAssetCode() === "USD") {
      const instruction: InstructionDepositFiat =
        wallet.getInstructionForDeposit() as InstructionDepositFiat;

      counterparty = CounterpartyBank.newCounterparty(
        {
          assetId: asset.getAssetId(),
          profileType:
            clientDestination.getClientType() === AccountType.INDIVIDUAL
              ? CounterpartyProfileType.INDIVIDUAL
              : CounterpartyProfileType.CORPORATION,
          accountId: clientDestination.getAccount().getAccountId(),
          clientId: clientOrigin.getClientId(),
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
          accountNumber: instruction.WIRE.accountNumber,
        },
        CounterpartyStatus.ACTIVE,
        true,
      );
    }

    if (asset.getAssetCode() === "USD_PA") {
      const instructions: InstructionsAchPabType = {
        label: "AHC PANAMA",
        holderEmail: clientDestination.getEmail(),
        accountDestinationNumber: "",
        bankName: "",
        productType: "",
        holderId: clientDestination.getIDNumber(),
        holderName: clientDestination.getName(),
      };
      const payload: CounterpartyAchPabDtoType = {
        achInstructions: instructions,
        clientId: clientOrigin.getClientId(),
        counterpartyId: clientDestination.getClientId(),
        counterpartyType: CounterpartyType.FIAT,
        status: CounterpartyStatus.ACTIVE,
        assetId: asset.getAssetId(),
        informationOwner: {
          name: clientDestination.getName(),
          address: undefined,
        },
      };

      counterparty = CounterpartyAchPab.newCounterparty(payload, true);
    }

    await this.counterpartyRepository.upsert(counterparty);

    return counterparty;
  }

  private async searchWallet(
    assetId: string,
    clientDestination: IClient,
    walletProvider: WalletProvider,
  ): Promise<IWallet> {
    const wallet: IWallet =
      await this.walletRepository.findWalletsByClientIdAndAssetId(
        clientDestination.getClientId(),
        assetId,
        walletProvider,
      );

    if (!wallet) {
      logger.info(
        `Wallet not found for client ${clientDestination.getName()} and asset ${assetId}`,
      );
      throw new WalletNotFound();
    }

    return wallet;
  }
}
