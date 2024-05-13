export class CommissionForRechargingCard {
  private id?: string;
  private feeRechargingWithCrypto: number;
  private feeRechargingWithFIAT: number;

  getId(): string {
    return this.id;
  }
  static fromPrimitives(data: any): CommissionForRechargingCard {
    const c: CommissionForRechargingCard = new CommissionForRechargingCard();

    c.feeRechargingWithCrypto = data.feeRechargingWithCrypto;
    c.feeRechargingWithFIAT = data.feeRechargingWithFIAT;

    return c;
  }

  getFeeRechargingWithCrypto(): number {
    return this.feeRechargingWithCrypto;
  }

  getFeeRechargingWithFIAT(): number {
    return this.feeRechargingWithFIAT;
  }

  toPrimitives(): any {
    return {
      feeRechargingWithCrypto: this.feeRechargingWithCrypto,
      feeRechargingWithFIAT: this.feeRechargingWithFIAT,
    };
  }
}
