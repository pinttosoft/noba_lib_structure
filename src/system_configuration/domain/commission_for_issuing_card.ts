export class CommissionForIssuingCard {
  private id?: string;
  private issuingVirtual: number;
  private issuingPhysical: {
    issuingFee: number;
    deliveryFee: number;
  };

  getId(): string {
    return this.id;
  }

  static fromPrimitives(data: any): CommissionForIssuingCard {
    const c: CommissionForIssuingCard = new CommissionForIssuingCard();

    c.issuingVirtual = data.issuingVirtual;
    c.issuingPhysical = {
      issuingFee: data.issuingPhysical.issuingFee,
      deliveryFee: data.issuingPhysical.deliveryFee,
    };

    return c;
  }

  getFeeIssuingVirtual(): number {
    return this.issuingVirtual;
  }

  getFeeIssuingPhysical(): { issuingFee: number; deliveryFee: number } {
    return this.issuingPhysical;
  }

  toPrimitives(): any {
    return {
      issuingVirtual: this.issuingVirtual,
      issuingPhysical: this.issuingPhysical,
    };
  }
}
