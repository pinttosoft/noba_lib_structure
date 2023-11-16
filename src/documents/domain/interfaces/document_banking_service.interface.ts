export interface IDocumentBankingServiceInterface {
  uploadFile(file: any, documentId: string): Promise<void>;
  downloadFile(file: any): Promise<void>;
}
