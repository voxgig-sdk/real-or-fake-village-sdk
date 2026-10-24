

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


describe('CountyEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE.
  afterEach(liveDelay('REAL_OR_FAKE_VILLAGE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = RealOrFakeVillageSDK.test()
    const ent = testsdk.County()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('county hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of RealOrFakeVillageSDK.test(offline).County().stream('list')) { }
    }, /offline/)

    for await (const _item of RealOrFakeVillageSDK.test(offline).County()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = RealOrFakeVillageSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.County().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of RealOrFakeVillageSDK.test().County().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new RealOrFakeVillageSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.County().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.County().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = RealOrFakeVillageSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.County().list({"code":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.REAL_OR_FAKE_VILLAGE_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'county.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"code":{"a":true,"h":"Code","n":"code","r":true,"sh":"County code, as judet takes it.","t":"`$STRING`","key$":"code","index$":0},"communes":{"a":true,"h":"Communes","n":"communes","r":true,"sh":"Communes, towns and cities in this county.","t":"`$INTEGER`","key$":"communes","index$":1},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"County name.","t":"`$STRING`","key$":"name","index$":2},"random":{"a":true,"h":"Random","n":"random","r":true,"sh":"Link to a random place in this county.","t":"`$STRING`","key$":"random","index$":3},"villages":{"a":true,"h":"Villages","n":"villages","r":true,"sh":"Places in the register in this county.","t":"`$INTEGER`","key$":"villages","index$":4}},"name":"county","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /sate/counties","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/sate/counties","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"sate"},{"lit":"counties"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"county","name__orig":"county","Name":"County","name_":"county","name-":"county","NAME":"COUNTY","index$":0}, {"active":true,"entity":"county","key$":"BasicCountyFlow","kind":"basic","name":"BasicCountyFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"county_ref01"}}],"index$":0}]}, 'County', {"GET /sate/counties":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let county_ref01_data = Object.values(setup.data.existing.county)[0] as any

    // LIST
    const county_ref01_ent = client.County()
    const county_ref01_match: any = {}

    const county_ref01_list = (await county_ref01_ent.list(county_ref01_match)).map((e: any) => e.data())


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
      '../../../../.sdk/test/entity/county/CountyTestData.json')

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
    ['county01','county02','county03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'REAL_OR_FAKE_VILLAGE_TEST_COUNTY_ENTID': idmap,
    'REAL_OR_FAKE_VILLAGE_TEST_LIVE': 'FALSE',
    'REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['REAL_OR_FAKE_VILLAGE_TEST_COUNTY_ENTID']

  const live = 'TRUE' === env.REAL_OR_FAKE_VILLAGE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['REAL_OR_FAKE_VILLAGE_TEST_COUNTY_ENTID']
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
  
