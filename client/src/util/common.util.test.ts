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
})

describe('calculatePercentage', () => {
  it('should calculate percentage', () => {
    expect(CommonUtil.calculatePercentage(undefined, undefined)).toBe(0)
    expect(CommonUtil.calculatePercentage("750", "1000")).toBe(75)
    expect(CommonUtil.calculatePercentage("751", "1000")).toBe(75)
  })
})

describe('calculateMaxRows', () => {
  it('should calculate max rows', () => {
    expect(CommonUtil.calculateMaxRows(0, 5, 0)).toBe(0)
    expect(CommonUtil.calculateMaxRows(3, 5, 0)).toBe(3)
    expect(CommonUtil.calculateMaxRows(10, 5, 0)).toBe(5)
    expect(CommonUtil.calculateMaxRows(10, 5, 1)).toBe(5)
    expect(CommonUtil.calculateMaxRows(11, 5, 2)).toBe(1)
  })
})