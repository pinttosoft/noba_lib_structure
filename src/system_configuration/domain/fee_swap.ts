import { AggregateRoot } from "../../shared/domain/aggregate_root";

export class FeeSwap extends AggregateRoot {
  private id?: string;
  private swapBuy: number;
  private swapSell: number;

  getId(): string {
    return this.id;
  }

  static fromPrimitives(data: any): FeeSwap {
    const f = new FeeSwap();
    f.swapBuy = data.swapBuy;
    f.swapSell = data.swapSell;
    f.id = data.id;

    return f;
  }

  toPrimitives(): any {
    return {
      swapBuy: this.swapBuy,
      swapSell: this.swapSell,
    };
  }
}
