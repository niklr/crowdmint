import { IChainUtil, NervosChainUtil } from './chain.util';

describe('NervosChainUtil.toNative', () => {
  let util: IChainUtil;
  beforeEach(() => {
    util = new NervosChainUtil();
  });
  it('should transform CKBit to CKByte', () => {
    expect(util.toNative('100000000').toString()).toBe('1')
    expect(util.toNative('100000001').toString()).toBe('1')
    expect(util.toNative('99999999').toString()).toBe('0')
    expect(util.toNative('1').toString()).toBe('0')
  })
})

describe('NervosChainUtil.toNativeString', () => {
  let util: IChainUtil;
  beforeEach(() => {
    util = new NervosChainUtil();
  });
  it('should transform CKBit to CKByte string', () => {
    expect(util.toNativeString('100000000')).toBe('1')
    expect(util.toNativeString('100000001')).toBe('1.00000001')
    expect(util.toNativeString('99999999')).toBe('0.99999999')
    expect(util.toNativeString('1')).toBe('0.00000001')
  })
})