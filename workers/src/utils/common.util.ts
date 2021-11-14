export abstract class CommonUtil {
  static isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  static isNullOrWhitespace(value: string): boolean {
    if (!CommonUtil.isString(value)) {
      // console.log('Expected a string but got: ', value);
      return true;
    } else {
      return value === null || value === undefined || value.trim() === '';
    }
  }

  static timeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static toJsonString(data: any): string {
    return JSON.stringify(data, null, 2);
  }
}