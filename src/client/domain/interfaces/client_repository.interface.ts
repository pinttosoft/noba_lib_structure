import { IClient } from "./client.interface";

export interface ClientRepository {
  upsert(client: IClient): Promise<void>;
  findByClientId(clientId: string): Promise<IClient | undefined>;
}
