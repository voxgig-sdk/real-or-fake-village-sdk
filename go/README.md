# RealOrFakeVillage Golang SDK



The Golang SDK for the RealOrFakeVillage API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.County(nil)` — each with the same small set of operations (`List`, `Load`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/real-or-fake-village-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Tags](https://github.com/voxgig-sdk/real-or-fake-village-sdk/tags) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/real-or-fake-village-sdk/go=../real-or-fake-village-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the entity, and for
`List` a `[]any` of entities, one per record (there is no `{ok, data}`
wrapper), so check `err` and read a record through the entity's
`Data()`.

```go
package main

import (
    "fmt"
    sdk "github.com/voxgig-sdk/real-or-fake-village-sdk/go"
)

func main() {
    client := sdk.New()

    // List county records — the value is a []any of entities, one per record.
    countys, err := client.County(nil).List(nil, nil)
    if err != nil {
        panic(err)
    }
    for _, item := range countys.([]any) {
        fmt.Println(item.(sdk.Entity).Data())
    }
}
```


## Error handling

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
random, err := client.Random(nil).Load(nil, nil)
if err != nil {
    // handle err
    return
}
_ = random
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

random, err := client.Random(nil).Load(
    nil, nil,
)
if err != nil {
    panic(err)
}
fmt.Println(random.(sdk.Entity).Data()) // the entity's mock record
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewRealOrFakeVillageSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
    },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE
```

Then run:

```bash
cd go && go test ./test/...
```


## Reference

### NewRealOrFakeVillageSDK

```go
func NewRealOrFakeVillageSDK(options map[string]any) *RealOrFakeVillageSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *RealOrFakeVillageSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### RealOrFakeVillageSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `County` | `(data map[string]any) RealOrFakeVillageEntityBase` | Create a County entity instance. |
| `Fake` | `(data map[string]any) RealOrFakeVillageEntityBase` | Create a Fake entity instance. |
| `Quiz` | `(data map[string]any) RealOrFakeVillageEntityBase` | Create a Quiz entity instance. |
| `Random` | `(data map[string]any) RealOrFakeVillageEntityBase` | Create a Random entity instance. |
| `Sate` | `(data map[string]any) RealOrFakeVillageEntityBase` | Create a Sate entity instance. |
| `Search` | `(data map[string]any) RealOrFakeVillageEntityBase` | Create a Search entity instance. |

### Entity interface (RealOrFakeVillageEntityBase)

All entities implement the `RealOrFakeVillageEntityBase` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria, and return it. |
| `List` | `(reqmatch, ctrl map[string]any) (any, error)` | List entities matching the criteria, one per record. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` | the entity, whose `Data()` reads its record (`map[string]any`) |
| `List` | a `[]any` of entities, one per record |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    county, err := client.County(nil).List(nil, nil)
    if err != nil { /* handle */ }
    // county is a []any of entities, one per record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### County

| Field | Description |
| --- | --- |
| `"code"` | County code, as judet takes it. |
| `"communes"` | Communes, towns and cities in this county. |
| `"name"` | County name. |
| `"random"` | Link to a random place in this county. |
| `"villages"` | Places in the register in this county. |

Operations: List.

API path: `/sate/counties`

#### Fake

| Field | Description |
| --- | --- |
| `"exists"` | Always false. |
| `"name"` | A made-up village name that is nowhere in the register. |
| `"permalink"` | Link that reproduces this name. |
| `"seed"` | The seed; the same seed always gives the same name. |
| `"sign"` | Link to its entry sign (SVG image). |

Operations: Load.

API path: `/sate/fake`

#### Quiz

| Field | Description |
| --- | --- |
| `"a"` | Name in slot a. |
| `"answer"` | The slot holding the real place. |
| `"b"` | Name in slot b. |
| `"correct"` | Whether the guess was right. |
| `"fake"` | The made-up name. |
| `"guess"` | The guess. |
| `"id"` |  |
| `"permalink"` | Link that reproduces this quiz. |
| `"play_again"` | Link to a fresh quiz. |
| `"question"` | The question, in English. |
| `"quip"` | A remark, in English. |
| `"real"` | A real place from SIRUTA, the Romanian register of localities. |
| `"seed"` | The seed; the same seed always gives the same quiz. |
| `"token"` | The quiz itself, signed (base64url payload plus HMAC). |

Operations: Load.

API path: `/sate/quiz/{token}`

#### Random

| Field | Description |
| --- | --- |
| `"commune"` | The administrative unit the place belongs to. |
| `"coordinates"` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `"county"` | The county. |
| `"exists"` | Always true for a real place. |
| `"is_seat"` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `"map"` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `"name"` | Place name, in proper case with comma-below ș and ț. |
| `"sign"` | Link to the place's entry sign (SVG image, not JSON). |
| `"siruta"` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `"type"` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `"where"` | The commune and county in words. |

Operations: Load.

API path: `/sate/random`

#### Sate

| Field | Description |
| --- | --- |
| `"communes"` | Communes, towns and cities. |
| `"counties"` | Counties, București included. |
| `"endpoints"` | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `"fake_names_learned_from"` | Distinct real names the fake-name machine learned from. |
| `"source"` | Data sources and licences. |
| `"villages"` | Real places in the register. |

Operations: Load.

API path: `/sate`

#### Search

| Field | Description |
| --- | --- |
| `"commune"` | The administrative unit the place belongs to. |
| `"coordinates"` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `"county"` | The county. |
| `"exists"` | Always true for a real place. |
| `"is_seat"` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `"map"` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `"name"` | Place name, in proper case with comma-below ș and ț. |
| `"sign"` | Link to the place's entry sign (SVG image, not JSON). |
| `"siruta"` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `"type"` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `"where"` | The commune and county in words. |

Operations: List.

API path: `/sate/search`



## Entities


### County

Create an instance: `county := client.County(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `code` | `string` | County code, as judet takes it. |
| `communes` | `int` | Communes, towns and cities in this county. |
| `name` | `string` | County name. |
| `random` | `string` | Link to a random place in this county. |
| `villages` | `int` | Places in the register in this county. |

#### Example: List

```go
countys, err := client.County(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range countys.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Fake

Create an instance: `fake := client.Fake(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `exists` | `bool` | Always false. |
| `name` | `string` | A made-up village name that is nowhere in the register. |
| `permalink` | `string` | Link that reproduces this name. |
| `seed` | `string` | The seed; the same seed always gives the same name. |
| `sign` | `string` | Link to its entry sign (SVG image). |

#### Example: Load

```go
fake, err := client.Fake(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(fake.(sdk.Entity).Data()) // the loaded entity's record
```


### Quiz

Create an instance: `quiz := client.Quiz(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `a` | `string` | Name in slot a. |
| `answer` | `string` | The slot holding the real place. |
| `b` | `string` | Name in slot b. |
| `correct` | `bool` | Whether the guess was right. |
| `fake` | `map[string]any` | The made-up name. |
| `guess` | `string` | The guess. |
| `id` | `string` |  |
| `permalink` | `string` | Link that reproduces this quiz. |
| `play_again` | `string` | Link to a fresh quiz. |
| `question` | `string` | The question, in English. |
| `quip` | `string` | A remark, in English. |
| `real` | `map[string]any` | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `string` | The seed; the same seed always gives the same quiz. |
| `token` | `string` | The quiz itself, signed (base64url payload plus HMAC). |

#### Example: Load

```go
quiz, err := client.Quiz(nil).Load(map[string]any{"id": "quiz_id", "guess": "guess"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(quiz.(sdk.Entity).Data()) // the loaded entity's record
```


### Random

Create an instance: `random := client.Random(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `map[string]any` | The administrative unit the place belongs to. |
| `coordinates` | `map[string]any` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `map[string]any` | The county. |
| `exists` | `bool` | Always true for a real place. |
| `is_seat` | `bool` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `int` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | The commune and county in words. |

#### Example: Load

```go
random, err := client.Random(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(random.(sdk.Entity).Data()) // the loaded entity's record
```


### Sate

Create an instance: `sate := client.Sate(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `communes` | `int` | Communes, towns and cities. |
| `counties` | `int` | Counties, București included. |
| `endpoints` | `map[string]any` | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `int` | Distinct real names the fake-name machine learned from. |
| `source` | `string` | Data sources and licences. |
| `villages` | `int` | Real places in the register. |

#### Example: Load

```go
sate, err := client.Sate(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(sate.(sdk.Entity).Data()) // the loaded entity's record
```


### Search

Create an instance: `search := client.Search(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `map[string]any` | The administrative unit the place belongs to. |
| `coordinates` | `map[string]any` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `map[string]any` | The county. |
| `exists` | `bool` | Always true for a real place. |
| `is_seat` | `bool` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `int` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | The commune and county in words. |

#### Example: List

```go
searchs, err := client.Search(nil).List(map[string]any{"q": "example"}, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range searchs.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```

## Features

This SDK ships 4 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### ratelimit

Rate limiting.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Retry.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

An operation returns the entity, and its `Data()` returns the record. Use
`core.ToMapAny()` to safely cast that record, or data nested in it, to
`map[string]any`: it returns `nil` for anything else, an entity included.

### Package structure

```
github.com/voxgig-sdk/real-or-fake-village-sdk/go/
├── real-or-fake-village.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/real-or-fake-village-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `Load`, the entity
stores the returned data and match criteria internally.

```go
random := client.Random(nil)
random.Load(nil, nil)

// random.Data() now returns the random data from the last load
// random.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
