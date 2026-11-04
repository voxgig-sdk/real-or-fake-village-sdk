# Quiz entity test

import json
import os
import time

import pytest

from realorfakevillage_sdk.utility.voxgig_struct import voxgig_struct as vs
from realorfakevillage_sdk import RealOrFakeVillageSDK
from realorfakevillage_sdk.core import helpers
from realorfakevillage_sdk.config import shared_config
from realorfakevillage_sdk.feature.base_feature import RealOrFakeVillageBaseFeature

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner



# main.kit.test.live.strict is true (the default is true): a live
# request that fails, or a live test missing an input it needs,
# fails the test.
# An account with no record for a test to read skips it either way.
LIVE_STRICT = True


class TestQuizEntity:

    def test_should_create_instance(self):
        testsdk = RealOrFakeVillageSDK.test(None, None)
        ent = testsdk.Quiz(None)
        assert ent is not None

    def test_should_refuse_an_invalid_request(self):
        if "validate" not in (shared_config().get("feature") or {}):
            pytest.skip("feature not present in this SDK: validate")
        client = RealOrFakeVillageSDK.test(
            None, {"feature": {"validate": {"active": True}}})
        with pytest.raises(Exception) as err:
            client.Quiz(None).load({"id": 1, "guess": "x"}, None)
        assert "validate_failed" == getattr(err.value, "code", None)

    def test_should_run_basic_flow(self):
        setup = _quiz_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["load"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "quiz." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        if setup["live"]:
            for _live_key, _live_ex in {"quiz01": "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw"}.items():
                if setup.get("synthetic_only") or setup["idmap"].get(_live_key) is None:
                    setup["idmap"][_live_key] = _live_ex
        client = setup["client"]
        if setup["live"]:
            runner.live_existing(setup, LIVE_STRICT, "quiz",
                                 lambda: [{"id": setup["idmap"].get("quiz01")}], "id", setup["idmap"].get("quiz01"))

        # Bootstrap entity data from existing test data.
        quiz_ref01_data_raw = vs.items(helpers.to_map(
            vs.getpath(setup["data"], "existing.quiz")))
        quiz_ref01_data = None
        if len(quiz_ref01_data_raw) > 0:
            quiz_ref01_data = helpers.to_map(quiz_ref01_data_raw[0][1])

        if setup["live"]:
            runner.live_pace()
        # LOAD
        quiz_ref01_ent = client.Quiz(None)
        quiz_ref01_match_dt0 = {
            "id": quiz_ref01_data["id"],
        }
        if setup["live"]:
            quiz_ref01_match_dt0["guess"] = "a"
        quiz_ref01_data_dt0_loaded = quiz_ref01_ent.load(quiz_ref01_match_dt0, None)
        quiz_ref01_data_dt0_load_result = helpers.to_map(runner.entity_data(quiz_ref01_data_dt0_loaded))
        assert quiz_ref01_data_dt0_load_result is not None
        if not setup["live"]:
            assert runner.live_same_id(quiz_ref01_data_dt0_load_result.get("id"), quiz_ref01_data["id"])



def _quiz_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/quiz/QuizTestData.json")
    with open(entity_data_file, "r", encoding="utf-8") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = RealOrFakeVillageSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["quiz01", "quiz02", "quiz03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Whether *_ENTID supplied the idmap, read before env_override consumes
    # it: without it, the ids a live flow binds are the fixture's synthetic ones.
    _entid_env_raw = os.environ.get(
        "REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID": idmap,
        "REAL_OR_FAKE_VILLAGE_TEST_LIVE": "FALSE",
        "REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN": "FALSE",
    })

    idmap_resolved = helpers.to_map(
        env.get("REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("REAL_OR_FAKE_VILLAGE_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            # FIRST, so the generated fields below win: sdk-test-control.json's
            # test.client.options adds to the live client, it does not
            # redirect it.
            runner.live_client_options(),
            {
            },
            extra or {},
        ])
        client = RealOrFakeVillageSDK(helpers.to_map(merged_opts))

    _live = env.get("REAL_OR_FAKE_VILLAGE_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
