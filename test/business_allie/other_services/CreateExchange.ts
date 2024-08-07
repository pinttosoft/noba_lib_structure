import {
  AmountValueObject,
  BusinessAllieStatus,
  Exchange,
  ExchangeMarketActionType,
  ExchangeMarketPayload,
  ExchangeMarketRequest,
  IAssetRepository,
  IBusinessAllieRepository,
  IExchangeIntegratorService,
  IExchangeRepository,
  InsufficientBalance,
  IWallet,
  IWalletRepository,
  logger,
  Referred,
  StringValueObject,
} from "../../../src";
import { FindWalletOtherService } from "./FindWallet";

export class CreateExchange {
  constructor(
    private readonly exchangeRepository: IExchangeRepository,
    private readonly exchangeIntegratorService: IExchangeIntegratorService,
    private readonly walletRepository: IWalletRepository,
    private readonly assetRepository: IAssetRepository,
    private readonly businessAllieRepository: IBusinessAllieRepository,
  ) {}

  async run(exchangeRequest: ExchangeMarketRequest): Promise<any> {
    try {
      const sourceWallet = await new FindWalletOtherService(
        this.walletRepository,
        this.assetRepository,
      ).run(exchangeRequest.clientId, exchangeRequest.sourceWalletId);

      if (sourceWallet.getBalanceAvailable() < exchangeRequest.amount) {
        logger.info(
          `Balance en wallet ${sourceWallet
            .getAsset()
            .getAssetCode()} ${sourceWallet.getBalanceAvailable()}`,
        );
        throw new InsufficientBalance();
      }

      const destinationWallet = await new FindWalletOtherService(
        this.walletRepository,
        this.assetRepository,
      ).run(exchangeRequest.clientId, exchangeRequest.destinationWalletId);

      let referred: Referred = undefined;
      const allie =
        await this.businessAllieRepository.getBusinessAllieByReferredClientId(
          exchangeRequest.clientId,
        );

      if (
        allie &&
        allie.toPrimitives().status === BusinessAllieStatus.APPROVED
      ) {
        referred = new Referred(
          allie
            .getReferrals()
            .find((referred) => referred.clientId === exchangeRequest.clientId),
        );
      }

      console.log("referred", referred);

      let exchange: Exchange = await this.createExchange(
        sourceWallet,
        destinationWallet,
        referred,
        exchangeRequest,
      );

      await this.exchangeRepository.upsert(exchange);

      return exchange.toPrimitives();
    } catch (e) {
      console.error("CreateExchange error: ", e);
    }
  }

  private async createExchange(
    sourceWallet: IWallet,
    destinationWallet: IWallet,
    referred: Referred,
    exchangeRequest: ExchangeMarketRequest,
  ): Promise<Exchange> {
    const exchangePayload: ExchangeMarketPayload = {
      sourceWallet: sourceWallet,
      destinationWallet: destinationWallet,
      amount: exchangeRequest.amount,
      action: ExchangeMarketActionType.FIX_SOURCE,
      description: `Exchange ${exchangeRequest.amount} ${sourceWallet
        .getAsset()
        .getAssetCode()} to ${destinationWallet.getAsset().getAssetCode()}`,
    };

    // todo, remove all todos
    // const exchangeResponse =
    //   await this.exchangeIntegratorService.createExchange(exchangePayload);
    if (process.env.NODE_ENV === "PROD") {
      throw "Remove todos";
    }
    const exchangeResponse = {
      id: "1",
      destination_details: {
        amount_to_credit: 0.000153336787,
      },
    };
    //

    logger.info(`response: `, exchangeResponse);

    return Exchange.newExchange(
      exchangeResponse.id,
      {
        assetCode: StringValueObject.create(exchangeRequest.sourceWalletId),
        wallet: exchangePayload.sourceWallet,
        amountDebit: AmountValueObject.create(exchangePayload.amount),
      },
      {
        assetCode: StringValueObject.create(
          exchangeRequest.destinationWalletId,
        ),
        wallet: exchangePayload.destinationWallet,
        amountCredit: AmountValueObject.create(
          exchangeResponse.destination_details.amount_to_credit,
        ),
      },
      referred,
    );
  }
}
