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
(0, node_test_1.describe)('QuizEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('REAL_OR_FAKE_VILLAGE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.RealOrFakeVillageSDK.test();
        const ent = testsdk.Quiz();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.RealOrFakeVillageSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Quiz().load({ "id": 1, "guess": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.REAL_OR_FAKE_VILLAGE_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'quiz.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "a": { "a": true, "h": "A", "n": "a", "r": true, "sh": "Name in slot a.", "t": "`$STRING`", "key$": "a", "index$": 0 }, "answer": { "a": true, "h": "Answer", "n": "answer", "r": true, "sh": "The slot holding the real place.", "t": "`$STRING`", "key$": "answer", "index$": 1 }, "b": { "a": true, "h": "B", "n": "b", "r": true, "sh": "Name in slot b.", "t": "`$STRING`", "key$": "b", "index$": 2 }, "correct": { "a": true, "h": "Correct", "n": "correct", "r": true, "sh": "Whether the guess was right.", "t": "`$BOOLEAN`", "key$": "correct", "index$": 3 }, "fake": { "a": true, "h": "Fake", "n": "fake", "r": true, "sh": "The made-up name.", "t": "`$OBJECT`", "key$": "fake", "index$": 4 }, "guess": { "a": true, "h": "Guess", "n": "guess", "r": true, "sh": "The guess.", "t": "`$STRING`", "key$": "guess", "index$": 5 }, "id": { "a": true, "h": "Id", "n": "id", "r": false, "t": "`$STRING`", "key$": "id", "index$": 6 }, "permalink": { "a": true, "h": "Permalink", "n": "permalink", "r": true, "sh": "Link that reproduces this quiz.", "t": "`$STRING`", "key$": "permalink", "index$": 7 }, "play_again": { "a": true, "h": "Play Again", "n": "play_again", "r": true, "sh": "Link to a fresh quiz.", "t": "`$STRING`", "key$": "play_again", "index$": 8 }, "question": { "a": true, "h": "Question", "n": "question", "r": true, "sh": "The question, in English.", "t": "`$STRING`", "key$": "question", "index$": 9 }, "quip": { "a": true, "h": "Quip", "n": "quip", "r": true, "sh": "A remark, in English.", "t": "`$STRING`", "key$": "quip", "index$": 10 }, "real": { "a": true, "h": "Real", "n": "real", "r": true, "sh": "A real place from SIRUTA, the Romanian register of localities.", "t": "`$OBJECT`", "key$": "real", "index$": 11 }, "seed": { "a": true, "h": "Seed", "n": "seed", "r": true, "sh": "The seed; the same seed always gives the same quiz.", "t": "`$STRING`", "key$": "seed", "index$": 12 }, "token": { "a": true, "h": "Token", "n": "token", "r": true, "sh": "The quiz itself, signed (base64url payload plus HMAC).", "t": "`$STRING`", "key$": "token", "index$": 13 } }, "id": { "field": "id", "name": "id" }, "name": "quiz", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /sate/quiz/{token}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "ex": "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw", "k": "param", "n": "id", "or": "token", "r": true, "t": "`$STRING`", "index$": 0 }], "query": [{ "a": true, "ex": "a", "k": "query", "n": "guess", "or": "guess", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/sate/quiz/{token}", "q": { "exist": ["guess", "id"] }, "r": { "param": { "token": "id" } }, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "sate" }, { "lit": "quiz" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }, { "a": true, "co": { "id": "GET /sate/quiz", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "ex": "mamaliga", "k": "query", "n": "seed", "or": "seed", "r": false, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/sate/quiz", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "sate" }, { "lit": "quiz" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 1 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "quiz", "name__orig": "quiz", "Name": "Quiz", "name_": "quiz", "name-": "quiz", "NAME": "QUIZ", "index$": 2 }, { "active": true, "entity": "quiz", "key$": "BasicQuizFlow", "kind": "basic", "name": "BasicQuizFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "quiz_ref01", "srcdatavar": "quiz_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-quiz_ref01" } }], "index$": 0 }] }, 'Quiz', { "GET /sate/quiz/{token}": { "protocol": "http", "parameters": [{ "name": "token", "in": "path", "required": true, "description": "The token from /sate/quiz.", "schema": { "type": "string" }, "example": "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw", "index$": 0 }, { "name": "guess", "in": "query", "required": true, "description": "Which slot you think is real.", "schema": { "type": "string", "enum": ["a", "b"] }, "example": "a", "index$": 1 }] }, "GET /sate/quiz": { "protocol": "http", "parameters": [{ "name": "seed", "in": "query", "required": false, "description": "1 to 64 letters, digits, - or _. The same seed gives the same result forever. Left out, a fresh one is made and echoed back.", "schema": { "type": "string", "pattern": "^[A-Za-z0-9_-]{1,64}$" }, "example": "mamaliga", "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let quiz_ref01_data = Object.values(setup.data.existing.quiz)[0];
        // LOAD
        const quiz_ref01_ent = client.Quiz();
        const quiz_ref01_match_dt0 = {};
        quiz_ref01_match_dt0.id = quiz_ref01_data.id;
        const quiz_ref01_data_dt0 = (await quiz_ref01_ent.load(quiz_ref01_match_dt0)).data();
        (0, node_assert_1.default)(quiz_ref01_data_dt0.id === quiz_ref01_data.id);
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
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/quiz/QuizTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.RealOrFakeVillageSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['quiz01', 'quiz02', 'quiz03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID': idmap,
        'REAL_OR_FAKE_VILLAGE_TEST_LIVE': 'FALSE',
        'REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID'];
    const live = 'TRUE' === env.REAL_OR_FAKE_VILLAGE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID'];
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
//# sourceMappingURL=QuizEntity.test.js.map