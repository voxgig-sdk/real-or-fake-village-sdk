

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


describe('SateEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE.
  afterEach(liveDelay('REAL_OR_FAKE_VILLAGE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = RealOrFakeVillageSDK.test()
    const ent = testsdk.Sate()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = RealOrFakeVillageSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Sate().load({"communes":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.REAL_OR_FAKE_VILLAGE_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'sate.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"communes":{"a":true,"h":"Communes","n":"communes","r":true,"sh":"Communes, towns and cities.","t":"`$INTEGER`","key$":"communes","index$":0},"counties":{"a":true,"h":"Counties","n":"counties","r":true,"sh":"Counties, București included.","t":"`$INTEGER`","key$":"counties","index$":1},"endpoints":{"a":true,"h":"Endpoints","n":"endpoints","r":true,"sh":"Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign).","t":"`$OBJECT`","key$":"endpoints","index$":2},"fake_names_learned_from":{"a":true,"h":"Fake Names Learned From","n":"fake_names_learned_from","r":true,"sh":"Distinct real names the fake-name machine learned from.","t":"`$INTEGER`","key$":"fake_names_learned_from","index$":3},"source":{"a":true,"h":"Source","n":"source","r":true,"sh":"Data sources and licences.","t":"`$STRING`","key$":"source","index$":4},"villages":{"a":true,"h":"Villages","n":"villages","r":true,"sh":"Real places in the register.","t":"`$INTEGER`","key$":"villages","index$":5}},"name":"sate","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /sate","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/sate","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"sate"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"sate","name__orig":"sate","Name":"Sate","name_":"sate","name-":"sate","NAME":"SATE","index$":4}, {"active":true,"entity":"sate","key$":"BasicSateFlow","kind":"basic","name":"BasicSateFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"sate_ref01","srcdatavar":"sate_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-sate_ref01"}}],"index$":0}]}, 'Sate', {"GET /sate":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let sate_ref01_data = Object.values(setup.data.existing.sate)[0] as any

    // LOAD
    const sate_ref01_ent = client.Sate()
    const sate_ref01_match_dt0: any = {}
    const sate_ref01_data_dt0 = (await sate_ref01_ent.load(sate_ref01_match_dt0)).data()
    assert(null != sate_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/sate/SateTestData.json')

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
    ['sate01','sate02','sate03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'REAL_OR_FAKE_VILLAGE_TEST_SATE_ENTID': idmap,
    'REAL_OR_FAKE_VILLAGE_TEST_LIVE': 'FALSE',
    'REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['REAL_OR_FAKE_VILLAGE_TEST_SATE_ENTID']

  const live = 'TRUE' === env.REAL_OR_FAKE_VILLAGE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['REAL_OR_FAKE_VILLAGE_TEST_SATE_ENTID']
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
  
