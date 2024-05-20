export class CommissionForIssuingCard {
  private id?: string;
  private issuingVirtual: number;
  private issuingPhysical: number;

  getId(): string {
    return this.id;
  }

  static fromPrimitives(data: any): CommissionForIssuingCard {
    const c: CommissionForIssuingCard = new CommissionForIssuingCard();

    c.issuingVirtual = data.issuingVirtual;
    c.issuingPhysical = data.issuingPhysical;

    return c;
  }

  getFeeIssuingVirtual(): number {
    return this.issuingVirtual;
  }

  getFeeIssuingPhysical(): number {
    return this.issuingPhysical;
  }

  toPrimitives(): any {
    return {
      issuingVirtual: this.issuingVirtual,
      issuingPhysical: this.issuingPhysical,
    };
  }
}
