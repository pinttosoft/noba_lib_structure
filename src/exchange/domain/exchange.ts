import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { ExchangeStatus } from "./enums/exchange_status.enum";
import { AmountValueObject, StringValueObject } from "../../shared";
import { BusinessOpportunity } from "../../business_allie_program";
import { IWallet } from "../../wallet";

export class Exchange extends AggregateRoot {
  private id?: string;
  private clientId: string;
  private exchangeId: string;
  private status: ExchangeStatus;
  private baseAmount: number;
  private totalAmount: number;
  private feeAmount: number;
  private feeNoba: number;
  private feeBusinessAllie: number;
  private feePercentageBusinessAllie: number;
  private feePercentageNoba: number;
  private sourceDetails: {
    assetCode: string;
    walletId: string;
    amountDebit: number;
  };
  private destinationDetails: {
    assetCode: string;
    walletId: string;
    amountCredit: number;
  };
  private createdAt: Date;
  private acceptedAt: Date;

  static newExchange(
    exchangeId: string,
    sourceDetails: {
      assetCode: StringValueObject;
      wallet: IWallet;
      amountDebit: AmountValueObject;
    },
    destinationDetails: {
      assetCode: StringValueObject;
      wallet: IWallet;
      amountCredit: AmountValueObject;
    },
    opportunity?: BusinessOpportunity,
  ): Exchange {
    const e: Exchange = new Exchange();

    e.clientId = sourceDetails.wallet.getClientId();
    e.exchangeId = exchangeId;
    e.status = ExchangeStatus.REQUESTED;

    e.createdAt = new Date();

    e.sourceDetails = {
      assetCode: sourceDetails.assetCode.getValue(),
      amountDebit: sourceDetails.amountDebit.getValue(),
      walletId: sourceDetails.wallet.getWalletId(),
    };

    e.destinationDetails = {
      assetCode: destinationDetails.assetCode.getValue(),
      amountCredit: destinationDetails.amountCredit.getValue(),
      walletId: destinationDetails.wallet.getWalletId(),
    };

    if (opportunity) {
      e.feePercentageBusinessAllie = opportunity.getFeeSwap();
    }

    if (sourceDetails.wallet.getAsset().getAssetCode() === "USD") {
      e.feePercentageNoba = sourceDetails.wallet
        .getClient()
        .getFeeSwap()
        .getFeeForBuy();
      e.baseAmount = sourceDetails.amountDebit.getValue();
    } else {
      e.feePercentageNoba = sourceDetails.wallet
        .getClient()
        .getFeeSwap()
        .getFeeForSell();
      e.baseAmount = destinationDetails.amountCredit.getValue();
    }

    e.calculateFee();

    return e;
  }

  static fromPrimitives(id: string, data: any): Exchange {
    const e: Exchange = new Exchange();
    e.clientId = data.clientId;
    e.exchangeId = data.exchangeId;
    e.status = data.status;
    e.baseAmount = data.baseAmount;
    e.totalAmount = data.totalAmount;
    e.feeAmount = data.feeAmount;
    e.feeNoba = data.feeNoba;
    e.feeBusinessAllie = data.feeBusinessAllie;
    e.sourceDetails = data.sourceDetails;
    e.destinationDetails = data.destinationDetails;
    e.createdAt = data.createdAt;
    e.acceptedAt = data.acceptedAt;
    e.id = id;
    e.feePercentageNoba = data.feePercentageNoba;
    e.feePercentageBusinessAllie = data.feePercentageBusinessAllie;

    return e;
  }

  getId(): string {
    return this.id;
  }

  getAssetCode(): string {
    return this.sourceDetails.assetCode;
  }

  calculateFee(): Exchange {
    //TODO posteriormente se analizara el caso de uso de aliados comerciales
    this.feeBusinessAllie = 0;

    if (
      this.destinationDetails.assetCode !== "USDT" &&
      this.sourceDetails.assetCode !== "USDT"
    ) {
      this.feeNoba =
        (this.destinationDetails.amountCredit * this.feePercentageNoba) / 100;
      return this;
    }

    const percentageAPIProvider =
      this.calculatePercentageChargedByAPIProvider();

    const finalPercentageToBeCharged =
      this.feePercentageNoba - percentageAPIProvider;

    console.log(
      `Proveedor de API cobro el procentaje de ${percentageAPIProvider} noba configuro el fee de ${this.feePercentageNoba}`,
    );

    if (finalPercentageToBeCharged <= 0) {
      this.feeNoba = 0;
      return;
    }

    console.log(
      `Porcentaje final que se va a cobrar al cliente ${finalPercentageToBeCharged}`,
    );

    this.feeNoba = (this.baseAmount * finalPercentageToBeCharged) / 100;

    this.feeAmount = Number(this.feeBusinessAllie) + Number(this.feeNoba);

    return this;
  }

  /**
   * Porcentaje cobrado por el proveedor de la API
   *
   */
  private calculatePercentageChargedByAPIProvider() {
    let diff = 0;
    if (this.destinationDetails.assetCode === "USD") {
      diff = this.sourceDetails.amountDebit - this.baseAmount;
    } else {
      diff = this.baseAmount - this.destinationDetails.amountCredit;
    }

    return (diff / this.baseAmount) * 100;
  }

  accept(): Exchange {
    this.status = ExchangeStatus.ACCEPTED;
    this.acceptedAt = new Date();
    return this;
  }

  setUpdateStatus(status: ExchangeStatus): Exchange {
    this.status = status;
    return this;
  }

  getExchangeId(): string {
    return this.exchangeId;
  }

  getStatus(): ExchangeStatus {
    return this.status;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getSourceDetails() {
    return this.sourceDetails;
  }

  getDestinationDetails() {
    return this.destinationDetails;
  }

  getClientId(): string {
    return this.clientId;
  }

  getFeeNoba() {
    return this.feeNoba;
  }

  getFeeBusinessAllie() {
    return this.feeBusinessAllie;
  }

  getTotalFee() {}

  setUpdateAmountReceived(amount: number): Exchange {
    this.destinationDetails.amountCredit = amount;
    return this;
  }

  toPrimitives(): any {
    return {
      clientId: this.clientId,
      exchangeId: this.exchangeId,
      status: this.status,
      baseAmount: this.baseAmount,
      totalAmount: this.totalAmount,
      feeAmount: this.feeAmount,
      feeNoba: this.feeNoba,
      feeBusinessAllie: this.feeBusinessAllie,
      sourceDetails: this.sourceDetails,
      destinationDetails: this.destinationDetails,
      createdAt: this.createdAt,
      acceptedAt: this.acceptedAt,
    };
  }
}
