import { Finance } from "../finance";

export interface IFinanceRepository {
  getByReferenceId(referenceId: string): Promise<Finance | undefined>;
  upsert(fee: Finance): Promise<void>;
}
