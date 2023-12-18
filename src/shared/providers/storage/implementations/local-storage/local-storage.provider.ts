import fs from 'fs';
import { injectable } from 'inversify';
import path from 'path';

import upload from '@src/config/upload/upload';
import { deleteFile } from '@src/utils/file';

import { IStorageProvider } from '../../interfaces/storage.interface';

@injectable()
export class LocalStorageProvider implements IStorageProvider {
  async upload(file: string): Promise<string> {
    const newPath =
      process.env.NODE_ENV === 'test'
        ? path.resolve(`${upload.tmpFolder}/test/qrcode`, file)
        : path.resolve(`${upload.tmpFolder}/qrcode`, file);

    await fs.promises.rename(path.resolve(upload.tmpFolder, file), newPath);
    await deleteFile(path.resolve(upload.tmpFolder, file));
    return file;
  }

  async delete(file: string): Promise<void> {
    const fileName =
      process.env.NODE_ENV === 'test'
        ? path.resolve(`${upload.tmpFolder}/test/qrcode`, file)
        : path.resolve(`${upload.tmpFolder}/qrcode`, file);
    await deleteFile(fileName);
  }
}
