

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


describe('SearchEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE.
  afterEach(liveDelay('REAL_OR_FAKE_VILLAGE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = RealOrFakeVillageSDK.test()
    const ent = testsdk.Search()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('search hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of RealOrFakeVillageSDK.test(offline).Search().stream('list')) { }
    }, /offline/)

    for await (const _item of RealOrFakeVillageSDK.test(offline).Search()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = RealOrFakeVillageSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Search().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of RealOrFakeVillageSDK.test().Search().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new RealOrFakeVillageSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Search().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Search().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = RealOrFakeVillageSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Search().list({"judet":1,"q":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.REAL_OR_FAKE_VILLAGE_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'search.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"commune":{"a":true,"h":"Commune","n":"commune","r":true,"sh":"The administrative unit the place belongs to.","t":"`$OBJECT`","key$":"commune","index$":0},"coordinates":{"a":true,"h":"Coordinates","n":"coordinates","r":true,"sh":"Where it is, from Wikidata; documented as null for the few places Wikidata has no point for.","t":"`$OBJECT`","key$":"coordinates","index$":1},"county":{"a":true,"h":"County","n":"county","r":true,"sh":"The county.","t":"`$OBJECT`","key$":"county","index$":2},"exists":{"a":true,"h":"Exists","n":"exists","r":true,"sh":"Always true for a real place.","t":"`$BOOLEAN`","key$":"exists","index$":3},"is_seat":{"a":true,"h":"Is Seat","n":"is_seat","r":true,"sh":"True for the village that is the seat of its commune, and for the main place of a town or city.","t":"`$BOOLEAN`","key$":"is_seat","index$":4},"map":{"a":true,"h":"Map","n":"map","r":true,"sh":"OpenStreetMap link to the coordinates; documented as null when there are none.","t":"`$STRING`","key$":"map","index$":5},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"Place name, in proper case with comma-below ș and ț.","t":"`$STRING`","key$":"name","index$":6},"sign":{"a":true,"h":"Sign","n":"sign","r":true,"sh":"Link to the place's entry sign (SVG image, not JSON).","t":"`$STRING`","key$":"sign","index$":7},"siruta":{"a":true,"h":"Siruta","n":"siruta","r":true,"sh":"The place's code in SIRUTA, the national register; tells apart places that share a name.","t":"`$INTEGER`","key$":"siruta","index$":8},"type":{"a":true,"h":"Type","n":"type","r":true,"sh":"sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own).","t":"`$STRING`","key$":"type","index$":9},"where":{"a":true,"h":"Where","n":"where","r":false,"sh":"The commune and county in words.","t":"`$STRING`","key$":"where","index$":10}},"name":"search","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /sate/search","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"MM","k":"query","n":"judet","or":"judet","r":false,"t":"`$STRING`","index$":0},{"a":true,"ex":1,"k":"query","n":"page","or":"page","r":false,"t":"`$INTEGER`","index$":1},{"a":true,"ex":5,"k":"query","n":"per_page","or":"per_page","r":false,"t":"`$INTEGER`","index$":2},{"a":true,"ex":"fundu","k":"query","n":"q","or":"q","r":true,"t":"`$STRING`","index$":3}]},"k":"http","m":"GET","o":"/sate/search","q":{"exist":["q"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"sate"},{"lit":"search"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"search","name__orig":"search","Name":"Search","name_":"search","name-":"search","NAME":"SEARCH","index$":5}, {"active":true,"entity":"search","key$":"BasicSearchFlow","kind":"basic","name":"BasicSearchFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"search_ref01"}}],"index$":0}]}, 'Search', {"GET /sate/search":{"protocol":"http","parameters":[{"name":"q","in":"query","required":true,"description":"2 to 40 characters to look for in the name (fundu finds Fundu Moldovei, gara finds Lehliu-Gară).","schema":{"type":"string","minLength":2,"maxLength":40},"example":"fundu","index$":0},{"name":"judet","in":"query","required":false,"description":"One county, by code (CJ, B) or by name, diacritics optional (cluj, bistrita-nasaud).","schema":{"type":"string"},"example":"MM","index$":1},{"name":"page","in":"query","required":false,"description":"Page number, from 1.","schema":{"type":"integer","minimum":1,"default":1},"example":1,"index$":2},{"name":"per_page","in":"query","required":false,"description":"Places per page, 1 to 50.","schema":{"type":"integer","minimum":1,"maximum":50,"default":20},"example":5,"index$":3}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let search_ref01_data = Object.values(setup.data.existing.search)[0] as any

    // LIST
    const search_ref01_ent = client.Search()
    const search_ref01_match: any = {}

    const search_ref01_list = (await search_ref01_ent.list(search_ref01_match)).map((e: any) => e.data())


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
      '../../../../.sdk/test/entity/search/SearchTestData.json')

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
    ['search01','search02','search03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'REAL_OR_FAKE_VILLAGE_TEST_SEARCH_ENTID': idmap,
    'REAL_OR_FAKE_VILLAGE_TEST_LIVE': 'FALSE',
    'REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['REAL_OR_FAKE_VILLAGE_TEST_SEARCH_ENTID']

  const live = 'TRUE' === env.REAL_OR_FAKE_VILLAGE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['REAL_OR_FAKE_VILLAGE_TEST_SEARCH_ENTID']
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
  
