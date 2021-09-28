import { TransformUtil } from './transform.util'

describe('toCKByte', () => {
  it('should transform CKBit to CKByte', () => {
    expect(TransformUtil.toCKByte('100000000').toString()).toBe('1')
    expect(TransformUtil.toCKByte('100000001').toString()).toBe('1')
    expect(TransformUtil.toCKByte('99999999').toString()).toBe('0')
    expect(TransformUtil.toCKByte('1').toString()).toBe('0')
  })
})

describe('toCKByteString', () => {
  it('should transform CKBit to CKByte string', () => {
    expect(TransformUtil.toCKByteString('100000000')).toBe('1')
    expect(TransformUtil.toCKByteString('100000001')).toBe('1.00000001')
    expect(TransformUtil.toCKByteString('99999999')).toBe('0.99999999')
    expect(TransformUtil.toCKByteString('1')).toBe('0.00000001')
  })
})