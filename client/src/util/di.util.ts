import { getNervosDataSource, IDataSource } from "../datasources";

export abstract class DependencyInjectionUtil {
  static getDataSource(): IDataSource {
    return getNervosDataSource();
  }
}
