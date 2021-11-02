import { getMockDataSource, IDataSource } from "../datasources";
import { getLogger } from "../util/logger";

const logger = getLogger();

export class CommonContext {
  private _datasource: IDataSource;

  constructor() {
    this._datasource = getMockDataSource();
  }

  async initAsync(): Promise<void> {
    this._datasource = getMockDataSource();
  }

  dispose(): void {
    logger.info("Disposing CommonContext")();
  }

  get datasource(): IDataSource {
    return this._datasource;
  }
}

const context = new CommonContext();

export const getCommonContext = () => {
  return context;
}
