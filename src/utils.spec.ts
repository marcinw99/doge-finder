import { getDogAPIDogParameter } from './utils'

describe('getFileUrl', () => {
  it('parses File into asset url', () => {
   // TODO
  })
})

describe('getDogAPIDogParameter', () => {
  it('properly parses Tensorflow response to Dog API compatible parameter', () => {
    expect(getDogAPIDogParameter('Golden retriever')).toBe('retriever/golden')
  })
})