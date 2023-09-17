import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { ExchangeStatus } from "./enums/exchange_status.enum";
import { AmountValueObject } from "../../shared";
import { BusinessOpportunityDTO } from "../../business_allie_program";
import { IWallet } from "../../wallet";

export class Exchange extends AggregateRoot {
  private id?: string;
  private clientId: string;
  private exchangeId: string;
  private status: ExchangeStatus;
  private baseAmount: number;
  private feeAmount: number;
  private totalAmount: number;
  private feeNoba: number;
  private feeBusinessAllie: number;
  private sourceDetails: {
    walletId: string;
    amountDebit: number;
  };
  private destinationDetails: {
    walletId: string;
    amountCredit: number;
  };
  private createdAt: Date;
  private acceptedAt: Date;

  static newExchange(
    exchangeId: string,
    sourceDetails: {
      wallet: IWallet;
      amountDebit: AmountValueObject;
    },
    destinationDetails: {
      wallet: IWallet;
      amountCredit: AmountValueObject;
    },
    opportunity?: BusinessOpportunityDTO,
  ): Exchange {
    const e: Exchange = new Exchange();

    e.clientId = sourceDetails.wallet.getClientId();
    e.exchangeId = exchangeId;
    e.status = ExchangeStatus.REQUESTED;

    if (sourceDetails.wallet.getWalletId().includes("USD")) {
      e.feeNoba = sourceDetails.wallet.getClient().getFeeSwap().getFeeForBuy();
      e.baseAmount = sourceDetails.amountDebit.getValue();
    } else {
      e.feeNoba = destinationDetails.wallet
        .getClient()
        .getFeeSwap()
        .getFeeForSell();
      e.baseAmount = destinationDetails.amountCredit.getValue();
    }
    e.createdAt = new Date();

    e.destinationDetails = {
      amountCredit: destinationDetails.amountCredit.getValue(),
      walletId: destinationDetails.wallet.getWalletId(),
    };

    e.sourceDetails = {
      amountDebit: sourceDetails.amountDebit.getValue(),
      walletId: sourceDetails.wallet.getWalletId(),
    };

    if (opportunity) {
      e.feeBusinessAllie = opportunity.feeSwap;
    }

    return e;
  }

  static fromPrimitives(id: string, data: any): Exchange {
    const e: Exchange = new Exchange();
    e.clientId = data.clientId;
    e.exchangeId = data.exchangeId;
    e.status = data.status;
    e.baseAmount = data.baseAmount;
    e.feeAmount = data.feeAmount;
    e.totalAmount = data.totalAmount;
    e.feeNoba = data.feeNoba;
    e.feeBusinessAllie = data.feeBusinessAllie;
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

  calculateFee(): Exchange {
    const fee: number = this.baseAmount * this.feeNoba;
    if (this.feeBusinessAllie > 0) {
      this.feeAmount = fee + this.feeBusinessAllie;
    } else {
      this.feeAmount = fee;
    }

    this.calculateTotalAmount();
    return this;
  }

  private calculateTotalAmount(): void {
    this.totalAmount = this.baseAmount + this.feeAmount;
  }

  accept(destination: { walletId: string; amountCredit: number }): Exchange {
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

  toPrimitives(): any {
    return {
      clientId: this.clientId,
      exchangeId: this.exchangeId,
      status: this.status,
      baseAmount: this.baseAmount,
      feeAmount: this.feeAmount,
      totalAmount: this.totalAmount,
      feeNoba: this.feeNoba,
      feeBusinessAllie: this.feeBusinessAllie,
      sourceDetails: this.sourceDetails,
      destinationDetails: this.destinationDetails,
      createdAt: this.createdAt,
      acceptedAt: this.acceptedAt,
    };
  }
}
