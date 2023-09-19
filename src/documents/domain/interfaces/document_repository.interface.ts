import { Documents } from "../documents";

export interface IDocumentRepository {
  findDocumentByClientId(clientId: string): Promise<Documents[]>;
  save(document: Documents): Promise<void>;
  update(oldDocumentId: string, document: Documents): Promise<void>;
}
