import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { FeeACHPAB } from "./types/fee_ach_pab.type";

export class FeeACHPanama extends AggregateRoot {
  private id?: string;
  private domestic: {
    in: number;
    out: number;
  };
  private international: {
    in: number;
    out: number;
  };

  getId(): string {
    return this.id;
  }

  static fromPrimitives(data: FeeACHPAB): FeeACHPanama {
    const f: FeeACHPanama = new FeeACHPanama();

    f.domestic = data.domestic;
    f.international = data.international;

    return f;
  }

  getFeeDomestic(): {
    in: number;
    out: number;
  } {
    return this.domestic;
  }

  getFeeInternational(): {
    in: number;
    out: number;
  } {
    return this.international;
  }

  toPrimitives(): any {
    return {
      domestic: {
        in: this.domestic.in,
        out: this.domestic.out,
      },
      international: {
        in: this.international.in,
        out: this.international.out,
      },
    };
  }
}
