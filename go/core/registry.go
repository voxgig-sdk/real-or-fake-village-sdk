package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewCountyEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntityBase

var NewFakeEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntityBase

var NewQuizEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntityBase

var NewRandomEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntityBase

var NewSateEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntityBase

var NewSearchEntityFunc func(client *RealOrFakeVillageSDK, entopts map[string]any) RealOrFakeVillageEntityBase

