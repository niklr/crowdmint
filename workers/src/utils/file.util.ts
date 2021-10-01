import fs from 'fs';

export abstract class FileUtil {
  abstract readFileAsync(path: string): Promise<any>;
  abstract writeFile(data: any, path?: string): void;
}

export class BrowserFileUtil extends FileUtil {
  async readFileAsync(path: string): Promise<any> {
    const response = await fetch(path);
    return response.text();
  }
  public writeFile(data: any, path?: string): void {
  }
}

export class LocalFileUtil extends FileUtil {
  public async readFileAsync(path: string): Promise<any> {
    return Promise.resolve(fs.readFileSync(path, 'utf8'));
  }

  public writeFile(data: any, path?: string): void {
    fs.writeFileSync(path, data, 'utf8');
  }
}

export enum FileUtilType {
  Browser = 0,
  Local = 1
}

export const getFileUtil = (type: FileUtilType = FileUtilType.Browser) => {
  switch (type) {
    case FileUtilType.Local:
      return new LocalFileUtil();
    default:
      return new BrowserFileUtil();
  }
}