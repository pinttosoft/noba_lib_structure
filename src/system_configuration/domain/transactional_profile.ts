export class TransactionalProfile {
  private id?: string;
  private maxAmountPerOperation: number;
  private maxMonthlyAmount: number;

  getId(): string {
    return this.id;
  }

  static fromPrimitives(data: any): TransactionalProfile {
    const c: TransactionalProfile = new TransactionalProfile();

    c.maxAmountPerOperation = data.maxAmountPerOperation;
    c.maxMonthlyAmount = data.maxMonthlyAmount;

    return c;
  }

  getMaxMonthlyAmount(): number {
    return this.maxMonthlyAmount;
  }

  getMaxAmountPerOperation(): number {
    return this.maxAmountPerOperation;
  }

  toPrimitives(): any {
    return {
      maxAmountPerOperation: this.maxAmountPerOperation,
      maxMonthlyAmount: this.maxMonthlyAmount,
    };
  }
}
