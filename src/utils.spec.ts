import { getDogAPIDogParameter } from './utils'

describe('getFileUrl', (): void => {
  it('parses File into asset url', (): void => {
    expect.assertions(0);
   // TODO
  })
})

describe('getDogAPIDogParameter', (): void => {
  it('properly parses Tensorflow response to Dog API compatible parameter', (): void => {
    expect.assertions(1)
    expect(getDogAPIDogParameter('Golden retriever')).toBe('retriever/golden')
  })
})