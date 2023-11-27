import { IClient } from "./client.interface";

export interface IClientRepository {
  upsert(client: IClient): Promise<void>;
  findByClientId(clientId: string): Promise<IClient | undefined>;
  findByEmail(email: string): Promise<IClient | undefined>;
  findByIDNumber(idNumber: string): Promise<IClient | undefined>;
  findByDni(dni: string): Promise<Boolean | undefined>;
  findAllActiveClients(): Promise<IClient[]>;
}
