import { Finance } from "../finance";
import { Criteria, Paginate } from "../../../shared";

export interface IFinanceRepository {
  getByReferenceId(referenceId: string): Promise<Finance | undefined>;

  upsert(fee: Finance): Promise<void>;

  list(
    criteria: Criteria,
    pipelines?: any[],
  ): Promise<Paginate<Finance> | undefined>;

  getAllieSwapConsolidate(
    clientId?: string,
    assetCode?: string,
  ): Promise<any[] | undefined>;

  exportFinance(criteria: Criteria): Promise<Finance[]>;
}
