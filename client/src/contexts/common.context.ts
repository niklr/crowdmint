import { getMockDataSource, IDataSource } from "../datasources";

export abstract class CommonContext {
  static getDataSource(): IDataSource {
    return getMockDataSource();
    //return getNervosDataSource();
  }
}
