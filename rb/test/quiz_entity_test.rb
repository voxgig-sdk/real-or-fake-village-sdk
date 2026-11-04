# Quiz entity test

require "minitest/autorun"
require "json"
require_relative "../RealOrFakeVillage_sdk"
require_relative "runner"

class QuizEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = RealOrFakeVillageSDK.test(nil, nil)
    ent = testsdk.Quiz(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = RealOrFakeVillageConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = RealOrFakeVillageSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Quiz(nil).load({ "id" => 1, "guess" => "x" }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = quiz_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "quiz." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    if setup[:live]
      { "quiz01" => "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw" }.each do |_live_key, _live_ex|
        if setup[:synthetic_only] || setup[:idmap][_live_key].nil?
          setup[:idmap][_live_key] = _live_ex
        end
      end
    end
    client = setup[:client]
    if setup[:live]
      Runner.live_existing(setup, LIVE_STRICT, "quiz", "id", setup[:idmap]["quiz01"]) do
        [{ "id" => setup[:idmap]["quiz01"] }]
      end
    end

    # Bootstrap entity data from existing test data.
    quiz_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.quiz")))
    quiz_ref01_data = nil
    if quiz_ref01_data_raw.length > 0
      quiz_ref01_data = Helpers.to_map(quiz_ref01_data_raw[0][1])
    end

    Runner.live_pace if setup[:live]
    # LOAD
    quiz_ref01_ent = client.Quiz(nil)
    quiz_ref01_match_dt0 = {
      "id" => quiz_ref01_data["id"],
    }
    if setup[:live]
      quiz_ref01_match_dt0["guess"] = "a"
    end
    quiz_ref01_data_dt0_loaded = quiz_ref01_ent.load(quiz_ref01_match_dt0, nil)
    quiz_ref01_data_dt0_load_result = Helpers.to_map(quiz_ref01_data_dt0_loaded.respond_to?(:data_get) ? quiz_ref01_data_dt0_loaded.data_get : quiz_ref01_data_dt0_loaded)
    assert !quiz_ref01_data_dt0_load_result.nil?
    assert Runner.live_same_id(quiz_ref01_data_dt0_load_result["id"], quiz_ref01_data["id"]) unless setup[:live]

  end
end

def quiz_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "quiz", "QuizTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = RealOrFakeVillageSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["quiz01", "quiz02", "quiz03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID" => idmap,
    "REAL_OR_FAKE_VILLAGE_TEST_LIVE" => "FALSE",
    "REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["REAL_OR_FAKE_VILLAGE_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
      },
      extra || {},
    ])
    client = RealOrFakeVillageSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["REAL_OR_FAKE_VILLAGE_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
