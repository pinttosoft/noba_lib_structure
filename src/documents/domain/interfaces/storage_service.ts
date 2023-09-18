export interface IStorageService {
  uploadFile(file: any): Promise<string>;
  downloadFile(fileName: string): Promise<string>;
}
