import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { ExchangeStatus } from "./enums/exchange_status.enum";
import { AmountValueObject, StringValueObject } from "../../shared";
import { Referred } from "../../business_allie_program";
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
    referred?: Referred,
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

    if (referred) {
      console.log("% referred getFeeSwap: ", referred.getFeeSwap());
      e.feePercentageBusinessAllie = referred.getFeeSwap();
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
    e.feePercentageNoba = data.feePercentageNoba;
    e.feeBusinessAllie = data.feeBusinessAllie;
    e.feePercentageBusinessAllie = data.feePercentageBusinessAllie;

    e.sourceDetails = data.sourceDetails;
    e.destinationDetails = data.destinationDetails;
    e.createdAt = data.createdAt;
    e.acceptedAt = data.acceptedAt;
    e.id = id;

    return e;
  }

  getId(): string {
    return this.id;
  }

  getAssetCode(): string {
    return this.sourceDetails.assetCode;
  }

  calculateFee(): Exchange {
    if (this.isStableCoinInvolved()) {
      this.calculateStableCoinFee();

      return this;
    }

    // USDT is not involved
    this.calculateNonUSDTFee();

    return this;
  }

  calculateNonUSDTFee(): Exchange {
    let finalPercentageToBeCharged: number = this.feePercentageNoba;
    if (this.feePercentageBusinessAllie) {
      finalPercentageToBeCharged += this.feePercentageBusinessAllie;
      this.feeBusinessAllie =
        (this.destinationDetails.amountCredit *
          this.feePercentageBusinessAllie) /
        100;
    }

    // Fee de Noba todo, se deberia dejar el de abajo(confirmar en async)
    // this.feeNoba =
    //   (this.destinationDetails.amountCredit * finalPercentageToBeCharged) / 100;

    this.feeNoba =
      (this.destinationDetails.amountCredit * this.feePercentageNoba) / 100;
    this.feeAmount =
      (this.destinationDetails.amountCredit * finalPercentageToBeCharged) / 100;
    console.log("--- aqui feeNoba", {
      amountCredit: this.destinationDetails.amountCredit,
      feePercentageNoba: this.feePercentageNoba,
    });
    console.log(
      "-> destinationDetails.amountCredit feePercentageNoba finalPercentageToBeCharged",
      {
        amountCredit: this.destinationDetails.amountCredit,
        feePercentageNoba: this.feePercentageNoba,
        finalPercentageToBeCharged,
      },
    );

    return this;
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
      feePercentageNoba: this.feePercentageNoba,
      feeBusinessAllie: this.feeBusinessAllie,
      feePercentageBusinessAllie: this.feePercentageBusinessAllie,
      sourceDetails: this.sourceDetails,
      destinationDetails: this.destinationDetails,
      createdAt: this.createdAt,
      acceptedAt: this.acceptedAt,
    };
  }

  private calculateStableCoinFee(): Exchange {
    const percentageAPIProvider =
      this.calculatePercentageChargedByAPIProvider();

    let finalPercentageToBeCharged =
      this.feePercentageNoba - percentageAPIProvider;

    if (this.feePercentageBusinessAllie) {
      finalPercentageToBeCharged += this.feePercentageBusinessAllie;

      this.feeBusinessAllie =
        (this.destinationDetails.amountCredit *
          this.feePercentageBusinessAllie) /
        100;
    }
    console.log(
      `-- Proveedor de API cobro el procentaje de ${percentageAPIProvider} noba configuro el fee de ${this.feePercentageNoba}`,
    );

    console.log("calculateUSDTFee", {
      feePercentageNoba: this.feePercentageNoba,
      percentageAPIProvider,
      finalPercentageToBeCharged,
      feePercentageBusinessAllie: this.feePercentageBusinessAllie,
    });

    if (finalPercentageToBeCharged <= 0) {
      this.feeNoba = 0;
      this.feeAmount = 0;
      return this;
    }
    console.log(
      `Porcentaje final que se va a cobrar al cliente ${finalPercentageToBeCharged}`,
    );

    this.feeNoba = (this.baseAmount * this.feePercentageNoba) / 100;
    this.feeAmount = (this.baseAmount * finalPercentageToBeCharged) / 100;
    // todo check
    // this.feeNoba = (this.baseAmount * finalPercentageToBeCharged) / 100;
    // this.feeAmount = (this.baseAmount * finalPercentageToBeCharged) / 100;
    // this.feeAmount = Number(this.feeBusinessAllie) + Number(this.feeNoba);
    console.log("test", {
      "(this.baseAmount * finalPercentageToBeCharged) / 100":
        (this.baseAmount * finalPercentageToBeCharged) / 100,
      "Number(this.feeBusinessAllie) + Number(this.feeNoba)":
        Number(this.feeBusinessAllie) + Number(this.feeNoba),
    });
    return this;
  }

  /**
   * Porcentaje cobrado por el proveedor de la API
   *
   */
  private calculatePercentageChargedByAPIProvider() {
    // todo use this, but check, cause is returning negative
    let diff = 0;
    if (this.destinationDetails.assetCode === "USD") {
      console.log("this.sourceDetails.amountDebit - this.baseAmount");
      diff = this.sourceDetails.amountDebit - this.baseAmount;
    } else {
      console.log("this.baseAmount - this.destinationDetails.amountCredit");
      diff = this.baseAmount - this.destinationDetails.amountCredit;
    }

    console.log(" calculatePercentageChargedByAPIProvider  ", {
      sourceDetails: this.sourceDetails,
      destinationDetails: this.destinationDetails,
      baseAmount: this.baseAmount,
      diff,
    });
    return (diff / this.baseAmount) * 100;
  }

  private isStableCoinInvolved(): Boolean {
    const stableCoins = ["USDT", "USDC", "TUSD"];
    return stableCoins.includes(this.destinationDetails.assetCode);
  }
}
