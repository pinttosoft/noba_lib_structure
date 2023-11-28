import { IClient } from "./client.interface";

export interface IClientRepository {
  upsert(client: IClient): Promise<void>;
  findByClientId(clientId: string): Promise<IClient | undefined>;
  findByAccountId(accountId: string): Promise<IClient | undefined>;
  findByEmail(email: string): Promise<IClient | undefined>;
  findByIDNumber(idNumber: string): Promise<IClient | undefined>;
  findAllActiveClients(): Promise<IClient[]>;
}
