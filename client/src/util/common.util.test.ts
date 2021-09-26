import { CommonUtil } from './common.util'

describe('truncateStringInTheMiddle', () => {
  it('should not change string with truncate positions great or equal than string length', () => {
    expect(CommonUtil.truncateStringInTheMiddle('foobar', 4, 2)).toBe('foobar')
    expect(CommonUtil.truncateStringInTheMiddle('foobar', 6, 6)).toBe('foobar')
  })

  it('should truncate string with three dots in the middle', () => {
    expect(CommonUtil.truncateStringInTheMiddle('foobarbaz', 3, 2)).toBe('foo...az')
    expect(CommonUtil.truncateStringInTheMiddle('foobarbaz', 1, 1)).toBe('f...z')
  })

  it('should calculate percentage', () => {
    expect(CommonUtil.calculatePercentage(undefined, undefined)).toBe(0)
    expect(CommonUtil.calculatePercentage("750", "1000")).toBe(75)
    expect(CommonUtil.calculatePercentage("751", "1000")).toBe(75)
  })
})