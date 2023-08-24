import { IClient } from "@/client";

export interface ClientRepository {
  upsert(client: IClient): Promise<void>;
  findByClientId(clientId: string): Promise<IClient | undefined>;
}
