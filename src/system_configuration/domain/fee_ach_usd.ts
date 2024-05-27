import { AggregateRoot } from "../../shared/domain/aggregate_root";

export class FeeAchUsd extends AggregateRoot {
  private id?: string;
  private in: number;
  private out: number;

  static fromPrimitives(data: any): FeeAchUsd {
    const f = new FeeAchUsd();
    f.in = data.in;
    f.out = data.out;
    f.id = data.id;

    return f;
  }

  getId(): string {
    return this.id;
  }

  getIn() {
    return this.in;
  }

  getOut() {
    return this.out;
  }

  toPrimitives(): any {
    return {
      in: this.in,
      out: this.out,
    };
  }
}
