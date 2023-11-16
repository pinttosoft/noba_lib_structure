export interface IDocumentBankingServiceInterface {
  uploadFile(file: any, documentId: string): Promise<string>;
  downloadFile(file: any): Promise<any>;
}
