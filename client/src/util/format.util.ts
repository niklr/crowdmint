import { CommonUtil } from './common.util';

export abstract class FormatUtil {
  static formatSnackbarMessage(data: any): string {
    if (data) {
      console.log(data)
      let message: string
      if (!CommonUtil.isString(data)) {
        if (data.message) {
          message = data.message
        }
        else if (data.error?.message) {
          message = data.error.message
        } else {
          message = JSON.stringify(data)
        }
      } else {
        message = data
      }
      if (message.length > 128) {
        return message.substr(0, 128) + "..."
      }
      return message
    }
    return "Something went wrong."
  }
}