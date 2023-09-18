export interface IStorageService {
  uploadFile(file: File): Promise<string>;
  downloadFile(fileName: string): Promise<string>;
}
