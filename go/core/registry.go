package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewCountyEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntity

var NewFakeEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntity

var NewQuizEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntity

var NewRandomEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntity

var NewSateEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntity

var NewSearchEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntity

