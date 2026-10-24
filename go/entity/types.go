// Typed models for the RealOrFakeVillage SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/real-or-fake-village-sdk/go/core"
)

// County is the typed data model for the county entity.
type County struct {
}

// CountyListMatch is the typed request payload for County.ListTyped.
type CountyListMatch struct {
	Code *string `json:"code,omitempty"`
	Communes *int `json:"communes,omitempty"`
	Name *string `json:"name,omitempty"`
	Random *string `json:"random,omitempty"`
	Villages *int `json:"villages,omitempty"`
}

// Fake is the typed data model for the fake entity.
type Fake struct {
}

// FakeLoadMatch is the typed request payload for Fake.LoadTyped.
type FakeLoadMatch struct {
	Seed *string `json:"seed,omitempty"`
}

// Quiz is the typed data model for the quiz entity.
type Quiz struct {
}

// QuizLoadMatch is the typed request payload for Quiz.LoadTyped.
type QuizLoadMatch struct {
	Id string `json:"id"`
	Guess string `json:"guess"`
}

// Random is the typed data model for the random entity.
type Random struct {
}

// RandomLoadMatch is the typed request payload for Random.LoadTyped.
type RandomLoadMatch struct {
	Judet *string `json:"judet,omitempty"`
}

// Sate is the typed data model for the sate entity.
type Sate struct {
}

// SateLoadMatch is the typed request payload for Sate.LoadTyped.
type SateLoadMatch struct {
	Communes *int `json:"communes,omitempty"`
	Counties *int `json:"counties,omitempty"`
	Endpoints *map[string]any `json:"endpoints,omitempty"`
	FakeNamesLearnedFrom *int `json:"fake_names_learned_from,omitempty"`
	Source *string `json:"source,omitempty"`
	Villages *int `json:"villages,omitempty"`
}

// Search is the typed data model for the search entity.
type Search struct {
}

// SearchListMatch is the typed request payload for Search.ListTyped.
type SearchListMatch struct {
	Judet *string `json:"judet,omitempty"`
	Page *int `json:"page,omitempty"`
	PerPage *int `json:"per_page,omitempty"`
	Q string `json:"q"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
