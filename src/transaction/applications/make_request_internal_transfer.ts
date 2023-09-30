import { MessageBus } from "../../shared/domain/interfaces/message_bus";
import {
  Counterparty,
  CounterpartyType,
  ICounterpartyRepository,
  RegisterOrSearchCounterpartyInternal,
} from "../../counterparty";
import {
  IWithdrawalRequestRepository,
  WithdrawalRequest,
  WithdrawalType,
} from "../../withdrawal";
import { Asset, IAssetRepository } from "../../asset";
import {
  IWalletRepository,
  UpdateLookBalanceWallet,
  ValidateBalance,
} from "../../wallet";
import { FindByClientId, IClient, IClientRepository } from "../../client";
import { AmountValueObject } from "../../shared";
import { logger } from "../../index";

export class MakeRequestInternalTransfer {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly assetRepository: IAssetRepository,
    private readonly withdrawalRequest: IWithdrawalRequestRepository,
    private readonly counterpartyRepository: ICounterpartyRepository,
  ) {}

  async run(
    clientIdOrigin: string,
    clientIdDestination: string,
    amount: number,
    assetCode: string,
    reference: string,
  ): Promise<string> {
    const clientOrigin: IClient = await new FindByClientId(
      this.clientRepository,
    ).run(clientIdOrigin);

    const clientDestination: IClient = await new FindByClientId(
      this.clientRepository,
    ).run(clientIdDestination);

    const asset: Asset = await this.assetRepository.findAssetByCode(assetCode);

    const counterparty: Counterparty =
      await new RegisterOrSearchCounterpartyInternal(
        this.walletRepository,
        this.counterpartyRepository,
      ).run(clientOrigin, clientDestination, asset);

    await new ValidateBalance(this.walletRepository).run(
      clientIdOrigin,
      amount,
      asset.getAssetId(),
    );

    const withdrawalRequest: WithdrawalRequest =
      WithdrawalRequest.createNewWithdrawalRequest(
        clientOrigin,
        counterparty,
        AmountValueObject.create(amount),
        reference,
        WithdrawalType.INTERNAL,
      );
    await this.withdrawalRequest.upsert(withdrawalRequest);
    logger.info(
      `id de la solicitud de la transferencia  ${withdrawalRequest.getWithdrawalId()}`,
    );

    await new UpdateLookBalanceWallet(this.walletRepository).run(
      clientOrigin.getClientId(),
      asset.getAssetId(),
      amount,
    );

    // await this.message.transmissionMessage(
    //   JSON.stringify({
    //     transactionId: withdrawalRequest.getWithdrawalId(),
    //     type: WithdrawalType.INTERNAL,
    //   }),
    //   counterparty.getCounterpartyType() === CounterpartyType.CRYPTO
    //     ? process.env.TOPIC_TRANSACTION_ASSET
    //     : process.env.TOPIC_TRANSACTION_FIAT,
    // );

    return withdrawalRequest.getWithdrawalId();
  }
}
