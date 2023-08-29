import { AggregateRoot } from "@/shared/domain/aggregate_root";
import { BeneficiaryInternalDTO } from "@/beneficiary";

export class BeneficiaryInternal extends AggregateRoot {
  constructor(private readonly beneficiary: BeneficiaryInternalDTO) {
    super();
  }

  addNewBeneficiary(beneficiary: {
    accountTo: string;
    name: string;
    email: string;
  }): void {
    const beneficiaryMap = new Map();

    this.beneficiary.beneficiaries.forEach((existingBeneficiary) => {
      beneficiaryMap.set(existingBeneficiary.email, existingBeneficiary);
    });

    beneficiaryMap.set(beneficiary.email, beneficiary);

    this.beneficiary.beneficiaries = Array.from(beneficiaryMap.values());
  }

  getId(): string {
    return this.beneficiary.id;
  }

  static fromPrimitives(
    beneficiary: BeneficiaryInternalDTO,
  ): BeneficiaryInternal {
    return new BeneficiaryInternal(beneficiary);
  }

  toPrimitives(): any {
    return {
      id: this.beneficiary.id,
      accountId: this.beneficiary.accountId,
      beneficiaries: this.beneficiary.beneficiaries,
      type: this.beneficiary.type,
    };
  }
}
