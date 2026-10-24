package voxgigrealorfakevillagesdk

import (
	"github.com/voxgig-sdk/real-or-fake-village-sdk/go/core"
	"github.com/voxgig-sdk/real-or-fake-village-sdk/go/entity"
	"github.com/voxgig-sdk/real-or-fake-village-sdk/go/feature"
	_ "github.com/voxgig-sdk/real-or-fake-village-sdk/go/utility"
)

// Type aliases preserve external API.
type RealOrFakeVillageSDK = core.RealOrFakeVillageSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type RealOrFakeVillageEntity = core.RealOrFakeVillageEntity
type StreamItem = core.StreamItem
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type RealOrFakeVillageError = core.RealOrFakeVillageError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewRatelimitFeatureFunc = func() core.Feature {
		return feature.NewRatelimitFeature()
	}
	core.NewRetryFeatureFunc = func() core.Feature {
		return feature.NewRetryFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewTimeoutFeatureFunc = func() core.Feature {
		return feature.NewTimeoutFeature()
	}
	core.NewCountyEntityFunc = func(client *core.RealOrFakeVillageSDK, entopts map[string]any) core.RealOrFakeVillageEntity {
		return entity.NewCountyEntity(client, entopts)
	}
	core.NewFakeEntityFunc = func(client *core.RealOrFakeVillageSDK, entopts map[string]any) core.RealOrFakeVillageEntity {
		return entity.NewFakeEntity(client, entopts)
	}
	core.NewQuizEntityFunc = func(client *core.RealOrFakeVillageSDK, entopts map[string]any) core.RealOrFakeVillageEntity {
		return entity.NewQuizEntity(client, entopts)
	}
	core.NewRandomEntityFunc = func(client *core.RealOrFakeVillageSDK, entopts map[string]any) core.RealOrFakeVillageEntity {
		return entity.NewRandomEntity(client, entopts)
	}
	core.NewSateEntityFunc = func(client *core.RealOrFakeVillageSDK, entopts map[string]any) core.RealOrFakeVillageEntity {
		return entity.NewSateEntity(client, entopts)
	}
	core.NewSearchEntityFunc = func(client *core.RealOrFakeVillageSDK, entopts map[string]any) core.RealOrFakeVillageEntity {
		return entity.NewSearchEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewRealOrFakeVillageSDK = core.NewRealOrFakeVillageSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var SharedConfig = core.SharedConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewRealOrFakeVillageSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *RealOrFakeVillageSDK  { return NewRealOrFakeVillageSDK(nil) }
func Test() *RealOrFakeVillageSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewRatelimitFeature = feature.NewRatelimitFeature
var NewRetryFeature = feature.NewRetryFeature
var NewTestFeature = feature.NewTestFeature
var NewTimeoutFeature = feature.NewTimeoutFeature
