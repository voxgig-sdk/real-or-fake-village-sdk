

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


describe('RandomEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE.
  afterEach(liveDelay('REAL_OR_FAKE_VILLAGE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = RealOrFakeVillageSDK.test()
    const ent = testsdk.Random()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = RealOrFakeVillageSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Random().load({"judet":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.REAL_OR_FAKE_VILLAGE_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'random.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"commune":{"a":true,"h":"Commune","n":"commune","r":true,"sh":"The administrative unit the place belongs to.","t":"`$OBJECT`","key$":"commune","index$":0},"coordinates":{"a":true,"h":"Coordinates","n":"coordinates","r":true,"sh":"Where it is, from Wikidata; documented as null for the few places Wikidata has no point for.","t":"`$OBJECT`","key$":"coordinates","index$":1},"county":{"a":true,"h":"County","n":"county","r":true,"sh":"The county.","t":"`$OBJECT`","key$":"county","index$":2},"exists":{"a":true,"h":"Exists","n":"exists","r":true,"sh":"Always true for a real place.","t":"`$BOOLEAN`","key$":"exists","index$":3},"is_seat":{"a":true,"h":"Is Seat","n":"is_seat","r":true,"sh":"True for the village that is the seat of its commune, and for the main place of a town or city.","t":"`$BOOLEAN`","key$":"is_seat","index$":4},"map":{"a":true,"h":"Map","n":"map","r":true,"sh":"OpenStreetMap link to the coordinates; documented as null when there are none.","t":"`$STRING`","key$":"map","index$":5},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"Place name, in proper case with comma-below ș and ț.","t":"`$STRING`","key$":"name","index$":6},"sign":{"a":true,"h":"Sign","n":"sign","r":true,"sh":"Link to the place's entry sign (SVG image, not JSON).","t":"`$STRING`","key$":"sign","index$":7},"siruta":{"a":true,"h":"Siruta","n":"siruta","r":true,"sh":"The place's code in SIRUTA, the national register; tells apart places that share a name.","t":"`$INTEGER`","key$":"siruta","index$":8},"type":{"a":true,"h":"Type","n":"type","r":true,"sh":"sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own).","t":"`$STRING`","key$":"type","index$":9},"where":{"a":true,"h":"Where","n":"where","r":false,"sh":"The commune and county in words.","t":"`$STRING`","key$":"where","index$":10}},"name":"random","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /sate/random","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"MM","k":"query","n":"judet","or":"judet","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/sate/random","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"sate"},{"lit":"random"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"random","name__orig":"random","Name":"Random","name_":"random","name-":"random","NAME":"RANDOM","index$":3}, {"active":true,"entity":"random","key$":"BasicRandomFlow","kind":"basic","name":"BasicRandomFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"random_ref01","srcdatavar":"random_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-random_ref01"}}],"index$":0}]}, 'Random', {"GET /sate/random":{"protocol":"http","parameters":[{"name":"judet","in":"query","required":false,"description":"One county, by code (CJ, B) or by name, diacritics optional (cluj, bistrita-nasaud).","schema":{"type":"string"},"example":"MM","index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let random_ref01_data = Object.values(setup.data.existing.random)[0] as any

    // LOAD
    const random_ref01_ent = client.Random()
    const random_ref01_match_dt0: any = {}
    const random_ref01_data_dt0 = (await random_ref01_ent.load(random_ref01_match_dt0)).data()
    assert(null != random_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/random/RandomTestData.json')

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
    ['random01','random02','random03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'REAL_OR_FAKE_VILLAGE_TEST_RANDOM_ENTID': idmap,
    'REAL_OR_FAKE_VILLAGE_TEST_LIVE': 'FALSE',
    'REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['REAL_OR_FAKE_VILLAGE_TEST_RANDOM_ENTID']

  const live = 'TRUE' === env.REAL_OR_FAKE_VILLAGE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['REAL_OR_FAKE_VILLAGE_TEST_RANDOM_ENTID']
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
  
