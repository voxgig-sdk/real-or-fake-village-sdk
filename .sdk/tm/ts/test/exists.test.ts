
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { RealOrFakeVillageSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = RealOrFakeVillageSDK.test()
    equal(testsdk instanceof RealOrFakeVillageSDK, true,
      'RealOrFakeVillageSDK.test() must return a client synchronously')
  })

})
