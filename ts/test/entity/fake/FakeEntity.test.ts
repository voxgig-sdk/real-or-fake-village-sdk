

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { RealOrFakeVillageSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('FakeEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE.
  afterEach(liveDelay('REAL_OR_FAKE_VILLAGE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = RealOrFakeVillageSDK.test()
    const ent = testsdk.Fake()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = RealOrFakeVillageSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Fake().load({"seed":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.REAL_OR_FAKE_VILLAGE_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'fake.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"exists":{"a":true,"h":"Exists","n":"exists","r":true,"sh":"Always false.","t":"`$BOOLEAN`","key$":"exists","index$":0},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"A made-up village name that is nowhere in the register.","t":"`$STRING`","key$":"name","index$":1},"permalink":{"a":true,"h":"Permalink","n":"permalink","r":true,"sh":"Link that reproduces this name.","t":"`$STRING`","key$":"permalink","index$":2},"seed":{"a":true,"h":"Seed","n":"seed","r":true,"sh":"The seed; the same seed always gives the same name.","t":"`$STRING`","key$":"seed","index$":3},"sign":{"a":true,"h":"Sign","n":"sign","r":true,"sh":"Link to its entry sign (SVG image).","t":"`$STRING`","key$":"sign","index$":4}},"name":"fake","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /sate/fake","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"mamaliga","k":"query","n":"seed","or":"seed","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/sate/fake","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"sate"},{"lit":"fake"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"fake","name__orig":"fake","Name":"Fake","name_":"fake","name-":"fake","NAME":"FAKE","index$":1}, {"active":true,"entity":"fake","key$":"BasicFakeFlow","kind":"basic","name":"BasicFakeFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"fake_ref01","srcdatavar":"fake_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-fake_ref01"}}],"index$":0}]}, 'Fake', {"GET /sate/fake":{"protocol":"http","parameters":[{"name":"seed","in":"query","required":false,"description":"1 to 64 letters, digits, - or _. The same seed gives the same result forever. Left out, a fresh one is made and echoed back.","schema":{"type":"string","pattern":"^[A-Za-z0-9_-]{1,64}$"},"example":"mamaliga","index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let fake_ref01_data = Object.values(setup.data.existing.fake)[0] as any

    // LOAD
    const fake_ref01_ent = client.Fake()
    const fake_ref01_match_dt0: any = {}
    const fake_ref01_data_dt0 = (await fake_ref01_ent.load(fake_ref01_match_dt0)).data()
    assert(null != fake_ref01_data_dt0)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/fake/FakeTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = RealOrFakeVillageSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['fake01','fake02','fake03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'REAL_OR_FAKE_VILLAGE_TEST_FAKE_ENTID': idmap,
    'REAL_OR_FAKE_VILLAGE_TEST_LIVE': 'FALSE',
    'REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['REAL_OR_FAKE_VILLAGE_TEST_FAKE_ENTID']

  const live = 'TRUE' === env.REAL_OR_FAKE_VILLAGE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['REAL_OR_FAKE_VILLAGE_TEST_FAKE_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new RealOrFakeVillageSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
