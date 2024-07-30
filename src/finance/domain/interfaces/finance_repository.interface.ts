import { Finance } from "../finance";
import { Criteria, Paginate } from "../../../shared";

export interface IFinanceRepository {
  getByReferenceId(referenceId: string): Promise<Finance | undefined>;

  upsert(fee: Finance): Promise<void>;

  list(criteria: Criteria): Promise<Paginate<Finance> | undefined>;
}
