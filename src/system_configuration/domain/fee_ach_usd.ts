import { AggregateRoot } from "../../shared/domain/aggregate_root";

export class FeeAchUsd extends AggregateRoot {
  private id?: string;
  private achUsd: {
    in: number;
    out: number;
  };

  static fromPrimitives(data: any): FeeAchUsd {
    const f = new FeeAchUsd();
    f.achUsd = data.achUsd;
    f.id = data.id;

    return f;
  }

  getId(): string {
    return this.id;
  }

  getFeeAchUsd(): {
    in: number;
    out: number;
  } {
    return this.achUsd;
  }

  toPrimitives(): any {
    return {
      achUsd: {
        in: this.achUsd.in,
        out: this.achUsd.out,
      },
    };
  }
}
