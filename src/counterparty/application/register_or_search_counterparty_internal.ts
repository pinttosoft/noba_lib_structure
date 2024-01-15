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
import {
  CounterpartyBank,
  CounterpartyBankDTO,
  InstructionDepositFiat,
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
  ): Promise<Counterparty> {
    // todo check and confirm
    /*let counterparty: Counterparty =
                                                                                                      await this.counterpartyRepository.findByCounterpartyIdAndAssetId(
                                                                                                        clientDestination.getClientId(),
                                                                                                        asset.getAssetId(),
                                                                                                      ); */
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
    );

    // PAB
    if (asset.getAssetCode() === "PAB") {
      const instructions: InstructionDepositFiat =
        wallet.getInstructionForDeposit() as InstructionDepositFiat;

      const counterpartyBank: CounterpartyBankDTO = {
        assetId: asset.getAssetId(),
        clientId: clientOrigin.getClientId(),
        counterpartyId: clientDestination.getClientId(),
        accountNumber: instructions.ACH_PAB.accountDestinationNumber,
        counterpartyType: CounterpartyType.FIAT,
        accountId: clientDestination.getAccount().getAccountId(),
        informationOwner: {
          address: clientDestination.getAddress(),
          name: clientDestination.getName(),
        },
        profileType:
          clientDestination.getClientType() === AccountType.INDIVIDUAL
            ? CounterpartyProfileType.INDIVIDUAL
            : CounterpartyProfileType.CORPORATION,
        informationBank: {
          address: undefined,
          bankName: instructions.ACH_PAB.bankName,
          networkBank: undefined,
        },
      };

      counterparty = CounterpartyBank.newCounterparty(
        counterpartyBank,
        CounterpartyStatus.ACTIVE,
        true,
      );
    } else if (asset.getAssetCode() !== "USD") {
      // crypto
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
    } else {
      // wire
      const instruction: InstructionDepositFiat =
        wallet.getInstructionForDeposit() as InstructionDepositFiat;

      counterparty = CounterpartyBank.newCounterparty(
        {
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
          assetId: wallet.getAsset().getAssetId(),
          accountNumber: instruction.WIRE.accountNumber,
        },
        CounterpartyStatus.ACTIVE,
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
      logger.info(
        `Wallet not found for client ${clientDestination.getClientId()} and asset ${assetId}`,
      );
      throw new WalletNotFound();
    }

    return wallet;
  }
}
