import { AggregateRoot } from "../../shared/domain/aggregate_root";
import {FeeACHPAB} from "./types/fee_ach_pab.type";

export class FeeACHPanama extends AggregateRoot {
  private id?: string;
  in: number;
  out: number;

  getId(): string {
    return this.id;
  }

  static fromPrimitives(data: any): FeeACHPanama {
    const f: FeeACHPanama = new FeeACHPanama();

    f.in = data.in;
    f.out = data.out;

    return f;
  }

  getFeeIn(): number {
    return this.in;
  }

  getFeeOut(): number {
    return this.out;
  }

  toPrimitives(): FeeACHPAB {
    return {
      in: this.in,
      out: this.out,
    };
  }
}
