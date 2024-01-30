import { PanamaBankingRails } from "../panama_banking_rails";

export interface IPanamaBankingRepository {
  fetchPanamaBanks(): Promise<PanamaBankingRails[] | undefined>;
}
