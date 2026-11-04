-- Quiz entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("real-or-fake-village_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

-- main.kit.test.live.strict is true (the default is true): a live
-- request that fails, or a live test missing an input it needs,
-- fails the test.
-- An account with no record for a test to read skips it either way.
local LIVE_STRICT = true


describe("QuizEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Quiz(nil)
    assert.is_not_nil(ent)
  end)

  it("should refuse an invalid request", function()
    local config = require("config_shared")()
    if type(config.feature) ~= "table" or config.feature.validate == nil then
      pending("feature not present in this SDK: validate")
      return
    end
    local client = sdk.test(nil, { feature = { validate = { active = true } } })
    local _, err = client:Quiz(nil):load({ ["id"] = 1, ["guess"] = "x" }, nil)
    assert.are.equal("validate_failed", type(err) == "table" and err.code or nil)
  end)

  it("should run basic flow", function()
    local setup = quiz_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"load"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "quiz." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    if setup.live then
      for _live_key, _live_ex in pairs({["quiz01"] = "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw"}) do
        if setup.synthetic_only or setup.idmap[_live_key] == nil then
          setup.idmap[_live_key] = _live_ex
        end
      end
    end
    local client = setup.client
    if setup.live then
      runner.live_existing(pending, setup, LIVE_STRICT, "quiz", function()
        return { { id = setup.idmap["quiz01"] } }
      end, "id", setup.idmap["quiz01"])
    end

    -- Bootstrap entity data from existing test data.
    local quiz_ref01_data_raw = vs.items(helpers.to_map(
      vs.getpath(setup.data, "existing.quiz")))
    local quiz_ref01_data = nil
    if #quiz_ref01_data_raw > 0 then
      quiz_ref01_data = helpers.to_map(quiz_ref01_data_raw[1][2])
    end

    if setup.live then
      runner.live_pace()
    end
    -- LOAD
    local quiz_ref01_ent = client:Quiz(nil)
    local quiz_ref01_match_dt0 = {
      id = quiz_ref01_data["id"],
    }
    if setup.live then
      quiz_ref01_match_dt0["guess"] = "a"
    end
    local quiz_ref01_data_dt0_loaded, err = quiz_ref01_ent:load(quiz_ref01_match_dt0, nil)
    assert.is_nil(err)
    local quiz_ref01_data_dt0_load_result = helpers.to_map(type(quiz_ref01_data_dt0_loaded) == 'table' and quiz_ref01_data_dt0_loaded.data_get and quiz_ref01_data_dt0_loaded:data_get() or quiz_ref01_data_dt0_loaded)
    assert.is_not_nil(quiz_ref01_data_dt0_load_result)
    if not setup.live then
      assert.is_true(runner.live_same_id(quiz_ref01_data_dt0_load_result["id"], quiz_ref01_data["id"]))
    end

  end)
end)

function quiz_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/quiz/QuizTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read quiz test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "quiz01", "quiz02", "quiz03" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Whether *_ENTID supplied the idmap, read before env_override consumes
  -- it: without it, the ids a live flow binds are the fixture's synthetic ones.
  local entid_env_raw = os.getenv("REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID"] = idmap,
    ["REAL_OR_FAKE_VILLAGE_TEST_LIVE"] = "FALSE",
    ["REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN"] = "FALSE",
  })

  local idmap_resolved = helpers.to_map(
    env["REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["REAL_OR_FAKE_VILLAGE_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      -- FIRST, so the generated fields below win: sdk-test-control.json's
      -- test.client.options adds to the live client, it does not redirect it.
      runner.live_client_options(),
      {
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["REAL_OR_FAKE_VILLAGE_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
