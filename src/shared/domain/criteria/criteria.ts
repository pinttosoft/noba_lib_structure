import { Filters } from "./filters";
import { Order } from "./order";

export class Criteria {
  readonly filters: Filters;
  readonly order: Order;
  readonly limit?: number;
  readonly offset?: number;
  readonly currentPage?: number;
  readonly pipelines?: any[];

  constructor(
    filters: Filters,
    order: Order,
    limit?: number,
    offset?: number,
    pipelines?: any[],
  ) {
    this.filters = filters;
    this.order = order;
    this.limit = limit;
    this.currentPage = offset;
    this.offset = offset !== undefined ? (offset - 1) * limit : undefined;
    this.pipelines = pipelines ?? null;
  }

  public hasFilters(): boolean {
    return this.filters.filters.length > 0;
  }

  public hasPipelines(): boolean {
    return this.pipelines.length > 0;
  }
}
