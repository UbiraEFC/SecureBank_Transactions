export interface IStorageProvider {
  upload(file: string): Promise<string>;
  delete(file: string): Promise<void>;
}
