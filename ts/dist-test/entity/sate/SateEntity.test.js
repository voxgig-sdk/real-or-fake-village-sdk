"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('SateEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('REAL_OR_FAKE_VILLAGE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.RealOrFakeVillageSDK.test();
        const ent = testsdk.Sate();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.RealOrFakeVillageSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Sate().load({ "communes": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.REAL_OR_FAKE_VILLAGE_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'sate.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "communes": { "a": true, "h": "Communes", "n": "communes", "r": true, "sh": "Communes, towns and cities.", "t": "`$INTEGER`", "key$": "communes", "index$": 0 }, "counties": { "a": true, "h": "Counties", "n": "counties", "r": true, "sh": "Counties, București included.", "t": "`$INTEGER`", "key$": "counties", "index$": 1 }, "endpoints": { "a": true, "h": "Endpoints", "n": "endpoints", "r": true, "sh": "Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign).", "t": "`$OBJECT`", "key$": "endpoints", "index$": 2 }, "fake_names_learned_from": { "a": true, "h": "Fake Names Learned From", "n": "fake_names_learned_from", "r": true, "sh": "Distinct real names the fake-name machine learned from.", "t": "`$INTEGER`", "key$": "fake_names_learned_from", "index$": 3 }, "source": { "a": true, "h": "Source", "n": "source", "r": true, "sh": "Data sources and licences.", "t": "`$STRING`", "key$": "source", "index$": 4 }, "villages": { "a": true, "h": "Villages", "n": "villages", "r": true, "sh": "Real places in the register.", "t": "`$INTEGER`", "key$": "villages", "index$": 5 } }, "name": "sate", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /sate", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "GET", "o": "/sate", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "sate" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "sate", "name__orig": "sate", "Name": "Sate", "name_": "sate", "name-": "sate", "NAME": "SATE", "index$": 4 }, { "active": true, "entity": "sate", "key$": "BasicSateFlow", "kind": "basic", "name": "BasicSateFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "sate_ref01", "srcdatavar": "sate_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-sate_ref01" } }], "index$": 0 }] }, 'Sate', { "GET /sate": { "protocol": "http", "parameters": [] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let sate_ref01_data = Object.values(setup.data.existing.sate)[0];
        // LOAD
        const sate_ref01_ent = client.Sate();
        const sate_ref01_match_dt0 = {};
        const sate_ref01_data_dt0 = (await sate_ref01_ent.load(sate_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != sate_ref01_data_dt0);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/sate/SateTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.RealOrFakeVillageSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['sate01', 'sate02', 'sate03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'REAL_OR_FAKE_VILLAGE_TEST_SATE_ENTID': idmap,
        'REAL_OR_FAKE_VILLAGE_TEST_LIVE': 'FALSE',
        'REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['REAL_OR_FAKE_VILLAGE_TEST_SATE_ENTID'];
    const live = 'TRUE' === env.REAL_OR_FAKE_VILLAGE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['REAL_OR_FAKE_VILLAGE_TEST_SATE_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.RealOrFakeVillageSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {},
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
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
    };
    return setup;
}
//# sourceMappingURL=SateEntity.test.js.map