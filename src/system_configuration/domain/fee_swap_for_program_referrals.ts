import { AggregateRoot } from "../../shared/domain/aggregate_root";

export class FeeSwapForProgramReferrals extends AggregateRoot {
  private id?: string;
  private noba: number;
  private sponsor: number;

  getId(): string {
    return this.id;
  }

  toPrimitives(): any {
    return {
      noba: this.noba,
      sponsor: this.sponsor,
    };
  }
}
