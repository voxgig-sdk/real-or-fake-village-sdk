package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "RealOrFakeVillage",
			"slug": "real-or-fake-village",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"now": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://api.tasta.space/v1",
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"county": map[string]any{},
				"fake": map[string]any{},
				"quiz": map[string]any{},
				"random": map[string]any{},
				"sate": map[string]any{},
				"search": map[string]any{},
			},
		},
		"entity": map[string]any{
			"county": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "code",
						"title": "Code",
						"type": "`$STRING`",
						"req": true,
						"short": "County code, as judet takes it.",
					},
					map[string]any{
						"name": "communes",
						"title": "Communes",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Communes, towns and cities in this county.",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
						"req": true,
						"short": "County name.",
					},
					map[string]any{
						"name": "random",
						"title": "Random",
						"type": "`$STRING`",
						"req": true,
						"short": "Link to a random place in this county.",
					},
					map[string]any{
						"name": "villages",
						"title": "Villages",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Places in the register in this county.",
					},
				},
				"name": "county",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sate/counties",
								"segments": []any{
									map[string]any{
										"lit": "sate",
									},
									map[string]any{
										"lit": "counties",
									},
								},
								"parts": []any{
									"sate",
									"counties",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"fake": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "exists",
						"title": "Exists",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "Always false.",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
						"req": true,
						"short": "A made-up village name that is nowhere in the register.",
					},
					map[string]any{
						"name": "permalink",
						"title": "Permalink",
						"type": "`$STRING`",
						"req": true,
						"short": "Link that reproduces this name.",
					},
					map[string]any{
						"name": "seed",
						"title": "Seed",
						"type": "`$STRING`",
						"req": true,
						"short": "The seed; the same seed always gives the same name.",
					},
					map[string]any{
						"name": "sign",
						"title": "Sign",
						"type": "`$STRING`",
						"req": true,
						"short": "Link to its entry sign (SVG image).",
					},
				},
				"name": "fake",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sate/fake",
								"segments": []any{
									map[string]any{
										"lit": "sate",
									},
									map[string]any{
										"lit": "fake",
									},
								},
								"parts": []any{
									"sate",
									"fake",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "seed",
											"orig": "seed",
											"type": "`$STRING`",
											"kind": "query",
											"example": "mamaliga",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"quiz": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "a",
						"title": "A",
						"type": "`$STRING`",
						"req": true,
						"short": "Name in slot a.",
					},
					map[string]any{
						"name": "answer",
						"title": "Answer",
						"type": "`$STRING`",
						"req": true,
						"short": "The slot holding the real place.",
					},
					map[string]any{
						"name": "b",
						"title": "B",
						"type": "`$STRING`",
						"req": true,
						"short": "Name in slot b.",
					},
					map[string]any{
						"name": "correct",
						"title": "Correct",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "Whether the guess was right.",
					},
					map[string]any{
						"name": "fake",
						"title": "Fake",
						"type": "`$OBJECT`",
						"req": true,
						"short": "The made-up name.",
					},
					map[string]any{
						"name": "guess",
						"title": "Guess",
						"type": "`$STRING`",
						"req": true,
						"short": "The guess.",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "permalink",
						"title": "Permalink",
						"type": "`$STRING`",
						"req": true,
						"short": "Link that reproduces this quiz.",
					},
					map[string]any{
						"name": "play_again",
						"title": "Play Again",
						"type": "`$STRING`",
						"req": true,
						"short": "Link to a fresh quiz.",
					},
					map[string]any{
						"name": "question",
						"title": "Question",
						"type": "`$STRING`",
						"req": true,
						"short": "The question, in English.",
					},
					map[string]any{
						"name": "quip",
						"title": "Quip",
						"type": "`$STRING`",
						"req": true,
						"short": "A remark, in English.",
					},
					map[string]any{
						"name": "real",
						"title": "Real",
						"type": "`$OBJECT`",
						"req": true,
						"short": "A real place from SIRUTA, the Romanian register of localities.",
					},
					map[string]any{
						"name": "seed",
						"title": "Seed",
						"type": "`$STRING`",
						"req": true,
						"short": "The seed; the same seed always gives the same quiz.",
					},
					map[string]any{
						"name": "token",
						"title": "Token",
						"type": "`$STRING`",
						"req": true,
						"short": "The quiz itself, signed (base64url payload plus HMAC).",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "quiz",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sate/quiz/{token}",
								"segments": []any{
									map[string]any{
										"lit": "sate",
									},
									map[string]any{
										"lit": "quiz",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"sate",
									"quiz",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"token": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "token",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
											"example": "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw",
										},
									},
									"query": []any{
										map[string]any{
											"name": "guess",
											"orig": "guess",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "a",
											"field": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"guess",
										"id",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sate/quiz",
								"segments": []any{
									map[string]any{
										"lit": "sate",
									},
									map[string]any{
										"lit": "quiz",
									},
								},
								"parts": []any{
									"sate",
									"quiz",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "seed",
											"orig": "seed",
											"type": "`$STRING`",
											"kind": "query",
											"example": "mamaliga",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"random": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "commune",
						"title": "Commune",
						"type": "`$OBJECT`",
						"req": true,
						"short": "The administrative unit the place belongs to.",
					},
					map[string]any{
						"name": "coordinates",
						"title": "Coordinates",
						"type": "`$OBJECT`",
						"req": true,
						"short": "Where it is, from Wikidata; documented as null for the few places Wikidata has no point for.",
					},
					map[string]any{
						"name": "county",
						"title": "County",
						"type": "`$OBJECT`",
						"req": true,
						"short": "The county.",
					},
					map[string]any{
						"name": "exists",
						"title": "Exists",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "Always true for a real place.",
					},
					map[string]any{
						"name": "is_seat",
						"title": "Is Seat",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "True for the village that is the seat of its commune, and for the main place of a town or city.",
					},
					map[string]any{
						"name": "map",
						"title": "Map",
						"type": "`$STRING`",
						"req": true,
						"short": "OpenStreetMap link to the coordinates; documented as null when there are none.",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
						"req": true,
						"short": "Place name, in proper case with comma-below ș and ț.",
					},
					map[string]any{
						"name": "sign",
						"title": "Sign",
						"type": "`$STRING`",
						"req": true,
						"short": "Link to the place's entry sign (SVG image, not JSON).",
					},
					map[string]any{
						"name": "siruta",
						"title": "Siruta",
						"type": "`$INTEGER`",
						"req": true,
						"short": "The place's code in SIRUTA, the national register; tells apart places that share a name.",
					},
					map[string]any{
						"name": "type",
						"title": "Type",
						"type": "`$STRING`",
						"req": true,
						"short": "sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own).",
					},
					map[string]any{
						"name": "where",
						"title": "Where",
						"type": "`$STRING`",
						"short": "The commune and county in words.",
					},
				},
				"name": "random",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sate/random",
								"segments": []any{
									map[string]any{
										"lit": "sate",
									},
									map[string]any{
										"lit": "random",
									},
								},
								"parts": []any{
									"sate",
									"random",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "judet",
											"orig": "judet",
											"type": "`$STRING`",
											"kind": "query",
											"example": "MM",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"sate": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "communes",
						"title": "Communes",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Communes, towns and cities.",
					},
					map[string]any{
						"name": "counties",
						"title": "Counties",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Counties, București included.",
					},
					map[string]any{
						"name": "endpoints",
						"title": "Endpoints",
						"type": "`$OBJECT`",
						"req": true,
						"short": "Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign).",
					},
					map[string]any{
						"name": "fake_names_learned_from",
						"title": "Fake Names Learned From",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Distinct real names the fake-name machine learned from.",
					},
					map[string]any{
						"name": "source",
						"title": "Source",
						"type": "`$STRING`",
						"req": true,
						"short": "Data sources and licences.",
					},
					map[string]any{
						"name": "villages",
						"title": "Villages",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Real places in the register.",
					},
				},
				"name": "sate",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sate",
								"segments": []any{
									map[string]any{
										"lit": "sate",
									},
								},
								"parts": []any{
									"sate",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"search": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "commune",
						"title": "Commune",
						"type": "`$OBJECT`",
						"req": true,
						"short": "The administrative unit the place belongs to.",
					},
					map[string]any{
						"name": "coordinates",
						"title": "Coordinates",
						"type": "`$OBJECT`",
						"req": true,
						"short": "Where it is, from Wikidata; documented as null for the few places Wikidata has no point for.",
					},
					map[string]any{
						"name": "county",
						"title": "County",
						"type": "`$OBJECT`",
						"req": true,
						"short": "The county.",
					},
					map[string]any{
						"name": "exists",
						"title": "Exists",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "Always true for a real place.",
					},
					map[string]any{
						"name": "is_seat",
						"title": "Is Seat",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "True for the village that is the seat of its commune, and for the main place of a town or city.",
					},
					map[string]any{
						"name": "map",
						"title": "Map",
						"type": "`$STRING`",
						"req": true,
						"short": "OpenStreetMap link to the coordinates; documented as null when there are none.",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
						"req": true,
						"short": "Place name, in proper case with comma-below ș and ț.",
					},
					map[string]any{
						"name": "sign",
						"title": "Sign",
						"type": "`$STRING`",
						"req": true,
						"short": "Link to the place's entry sign (SVG image, not JSON).",
					},
					map[string]any{
						"name": "siruta",
						"title": "Siruta",
						"type": "`$INTEGER`",
						"req": true,
						"short": "The place's code in SIRUTA, the national register; tells apart places that share a name.",
					},
					map[string]any{
						"name": "type",
						"title": "Type",
						"type": "`$STRING`",
						"req": true,
						"short": "sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own).",
					},
					map[string]any{
						"name": "where",
						"title": "Where",
						"type": "`$STRING`",
						"short": "The commune and county in words.",
					},
				},
				"name": "search",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sate/search",
								"segments": []any{
									map[string]any{
										"lit": "sate",
									},
									map[string]any{
										"lit": "search",
									},
								},
								"parts": []any{
									"sate",
									"search",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "judet",
											"orig": "judet",
											"type": "`$STRING`",
											"kind": "query",
											"example": "MM",
										},
										map[string]any{
											"name": "page",
											"orig": "page",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 1,
										},
										map[string]any{
											"name": "per_page",
											"orig": "per_page",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 5,
										},
										map[string]any{
											"name": "q",
											"orig": "q",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "fundu",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"q",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
