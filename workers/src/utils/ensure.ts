export class Ensure {

  public static notNull(property: any, propertyName: string) {
    if (property === null || property === undefined) {
      throw new Error('Unexpected null exception. ' + propertyName);
    }
  }

  public static notNullOrWhiteSpace(property: string, propertyName: string, message?: string) {
    if (property === null || property === undefined || property?.trim() === '') {
      if (message) {
        throw new Error(message);
      } else {
        throw new Error('Unexpected null exception. ' + propertyName);
      }
    }
  }

  public static maxLength(property: string, propertyName: string, maxLength: number) {
    if (property && property.length > maxLength) {
      throw new Error(`${propertyName} exceeds the maximum length of ${maxLength}`);
    }
  }

}
