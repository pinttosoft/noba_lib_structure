import { AggregateRoot } from "../../shared/domain/aggregate_root";

export class PanamaBankingRails extends AggregateRoot {
  private id: string;
  private bankName: string;
  private bankId: string;

  getId(): string {
    return this.id;
  }

  getBankName(): string {
    return this.bankName;
  }

  getBankId(): string {
    return this.bankId;
  }

  fromPrimitives(data: any): PanamaBankingRails {
    const panamaBank = new PanamaBankingRails();

    panamaBank.id = data.id;
    panamaBank.bankName = data.bankName;
    panamaBank.bankId = data.bankId;

    return panamaBank;
  }

  toPrimitives(): any {
    return {
      bankName: this.bankName,
      bankId: this.bankId,
    };
  }
}
