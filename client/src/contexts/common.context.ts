import { getMockDataSource, getNervosDataSource, IDataSource } from "../datasources";
import { getLogger } from "../util/logger";

const logger = getLogger();

export class CommonContext {
  private _datasource: IDataSource;

  constructor() {
    this._datasource = getMockDataSource();
  }

  async initAsync(): Promise<void> {
    this._datasource = getNervosDataSource();
    await this._datasource.initAsync();
  }

  dispose(): void {
    logger.info("Disposing CommonContext")();
    this._datasource.dispose();
  }

  get datasource(): IDataSource {
    return this._datasource;
  }
}

const context = new CommonContext();

export const getCommonContext = () => {
  return context;
}
