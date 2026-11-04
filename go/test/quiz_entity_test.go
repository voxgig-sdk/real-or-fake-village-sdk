package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/real-or-fake-village-sdk/go"
	"github.com/voxgig-sdk/real-or-fake-village-sdk/go/core"

	vs "github.com/voxgig-sdk/real-or-fake-village-sdk/go/utility/struct"
)

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const quizEntityLiveStrict = true


func TestQuizEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Quiz(nil)
		if ent == nil {
			t.Fatal("expected non-nil QuizEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.Quiz(nil).Load(map[string]any{"id": 1, "guess": "x"}, nil)
		if sdkerr, ok := err.(*core.RealOrFakeVillageError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
		setup := quizBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"load"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "quiz." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		if setup.live {
			for _liveKey, _liveEx := range map[string]any{"quiz01": "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw"} {
				if setup.syntheticOnly || setup.idmap[_liveKey] == nil {
					setup.idmap[_liveKey] = _liveEx
				}
			}
		}
		client := setup.client
		_ = client
		if setup.live {
			liveExisting(t, quizEntityLiveStrict, setup.data, "quiz", "id", setup.idmap["quiz01"],
				func() (any, error) {
					return []any{map[string]any{"id": setup.idmap["quiz01"]}}, nil
				})
		}

		// Bootstrap entity data from existing test data (no create step in flow).
		quizRef01DataRaw := vs.Items(core.ToMapAny(vs.GetPath(setup.data, "existing.quiz")))
		var quizRef01Data map[string]any
		if len(quizRef01DataRaw) > 0 {
			quizRef01Data = core.ToMapAny(quizRef01DataRaw[0][1])
		}
		// Discard guards against Go's unused-var check when the flow's steps
		// happen not to consume the bootstrap data (e.g. list-only flows).
		_ = quizRef01Data

		if setup.live {
			livePace()
		}
		// LOAD
		quizRef01Ent := client.Quiz(nil)
		quizRef01MatchDt0 := map[string]any{
			"id": quizRef01Data["id"],
		}
		if setup.live {
			quizRef01MatchDt0["guess"] = "a"
		}
		quizRef01DataDt0Loaded, err := quizRef01Ent.Load(quizRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		quizRef01DataDt0LoadResult := core.ToMapAny(entityData(quizRef01DataDt0Loaded))
		if quizRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if !setup.live && !liveSameId(quizRef01DataDt0LoadResult["id"], quizRef01Data["id"]) {
			t.Fatal("expected load result id to match")
		}

	})
}

func quizBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "quiz", "QuizTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read quiz test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse quiz test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"quiz01", "quiz02", "quiz03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID": idmap,
		"REAL_OR_FAKE_VILLAGE_TEST_LIVE":      "FALSE",
		"REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN":   "FALSE",
	})

	idmapResolved := core.ToMapAny(env["REAL_OR_FAKE_VILLAGE_TEST_QUIZ_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["REAL_OR_FAKE_VILLAGE_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
			},
			extraOpts,
		})
		client = sdk.NewRealOrFakeVillageSDK(core.ToMapAny(mergedOpts))
	}

	live := env["REAL_OR_FAKE_VILLAGE_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["REAL_OR_FAKE_VILLAGE_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
