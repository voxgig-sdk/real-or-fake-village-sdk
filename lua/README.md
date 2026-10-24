# RealOrFakeVillage Lua SDK



The Lua SDK for the RealOrFakeVillage API — an entity-oriented client using Lua conventions.

It exposes the API as capitalised, semantic **Entities** — e.g. `client:County()` — each with the same small set of operations (`list`, `load`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to LuaRocks. Install it from the
GitHub release tag (`lua/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/real-or-fake-village-sdk/tags)),
or add the source directory to your `LUA_PATH`:

```bash
export LUA_PATH="path/to/lua/?.lua;path/to/lua/?/init.lua;;"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```lua
local sdk = require("real-or-fake-village_sdk")

local client = sdk.new()
```

### 2. List county records

Entity operations return `(value, err)`. For `list`, `value` is an
array of entities, one per record — iterate it directly (there is no
wrapper), and read each record with `data_get()`.

```lua
local countys, err = client:County():list()
if err then error(err) end

for _, item in ipairs(countys) do
  for k, val in pairs(item:data_get()) do print(k, val) end
end
```


## Error handling

Entity operations return `(value, err)`. Check `err` before using
the value:

```lua
local random, err = client:Random():load()
if err then error(err) end
```

`direct` follows the same `(value, err)` convention:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example_id" },
})
if err then error(err) end
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
if err then error(err) end

if result["ok"] then
  print(result["status"])  -- 200
  print(result["data"])    -- response body
end
```

### Prepare a request without sending it

```lua
local fetchdef, err = client:prepare({
  path = "/api/resource/{id}",
  method = "DELETE",
  params = { id = "example" },
})
if err then error(err) end

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```lua
local client = sdk.test()

local result, err = client:Random():load()
-- result is the entity; data_get() reads its mock record; err is set on failure
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```lua
local function mock_fetch(url, init)
  return {
    status = 200,
    statusText = "OK",
    headers = {},
    json = function()
      return { id = "mock01" }
    end,
  }, nil
end

local client = sdk.new({
  base = "http://localhost:8080",
  system = {
    fetch = mock_fetch,
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
cd lua && busted test/
```


## Reference

### RealOrFakeVillageSDK

```lua
local sdk = require("real-or-fake-village_sdk")
local client = sdk.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `table` | Feature activation flags. |
| `extend` | `table` | Additional Feature instances to load. |
| `system` | `table` | System overrides (e.g. custom `fetch` function). |

### test

```lua
local client = sdk.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### RealOrFakeVillageSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> table` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> table, err` | Build an HTTP request definition without sending. |
| `direct` | `(fetchargs) -> table, err` | Build and send an HTTP request. |
| `County` | `(data) -> CountyEntity` | Create a County entity instance. |
| `Fake` | `(data) -> FakeEntity` | Create a Fake entity instance. |
| `Quiz` | `(data) -> QuizEntity` | Create a Quiz entity instance. |
| `Random` | `(data) -> RandomEntity` | Create a Random entity instance. |
| `Sate` | `(data) -> SateEntity` | Create a Sate entity instance. |
| `Search` | `(data) -> SearchEntity` | Create a Search entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any, err` | Load a single entity by match criteria, and return it. |
| `list` | `(reqmatch, ctrl) -> any, err` | List entities matching the criteria, one per record. |
| `data_get` | `() -> table` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> table` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> string` | Return the entity name. |

### Result shape

Entity operations return `(value, err)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `load` | the entity, whose `data_get()` reads its record (a `table`) |
| `list` | an array (`table`) of entities, one per record |

Check `err` first (it is non-`nil` on failure), then use `value`:

    local fake, err = client:Fake():load()
    if err then error(err) end
    -- fake is the loaded entity

Only `direct()` returns a response envelope — a `table` with `ok`,
`status`, `headers`, and `data` keys.

### Entities

#### County

| Field | Description |
| --- | --- |
| `code` | County code, as judet takes it. |
| `communes` | Communes, towns and cities in this county. |
| `name` | County name. |
| `random` | Link to a random place in this county. |
| `villages` | Places in the register in this county. |

Operations: List.

API path: `/sate/counties`

#### Fake

| Field | Description |
| --- | --- |
| `data` | A machine-made village name (order-3 character Markov chain trained on the real names, filtered against the register). |
| `meta` |  |

Operations: Load.

API path: `/sate/fake`

#### Quiz

| Field | Description |
| --- | --- |
| `a` | Name in slot a. |
| `answer` | The slot holding the real place. |
| `b` | Name in slot b. |
| `correct` | Whether the guess was right. |
| `fake` | The made-up name. |
| `guess` | The guess. |
| `id` |  |
| `permalink` | Link that reproduces this quiz. |
| `play_again` | Link to a fresh quiz. |
| `question` | The question, in English. |
| `quip` | A remark, in English. |
| `real` | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | The seed; the same seed always gives the same quiz. |
| `token` | The quiz itself, signed (base64url payload plus HMAC). |

Operations: Load.

API path: `/sate/quiz/{token}`

#### Random

| Field | Description |
| --- | --- |
| `commune` | The administrative unit the place belongs to. |
| `coordinates` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | The county. |
| `exists` | Always true for a real place. |
| `is_seat` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | Place name, in proper case with comma-below ș and ț. |
| `sign` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | The commune and county in words. |

Operations: Load.

API path: `/sate/random`

#### Sate

| Field | Description |
| --- | --- |
| `communes` | Communes, towns and cities. |
| `counties` | Counties, București included. |
| `endpoints` | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | Distinct real names the fake-name machine learned from. |
| `source` | Data sources and licences. |
| `villages` | Real places in the register. |

Operations: Load.

API path: `/sate`

#### Search

| Field | Description |
| --- | --- |
| `commune` | The administrative unit the place belongs to. |
| `coordinates` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | The county. |
| `exists` | Always true for a real place. |
| `is_seat` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | Place name, in proper case with comma-below ș and ț. |
| `sign` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | The commune and county in words. |

Operations: List.

API path: `/sate/search`



## Entities


### County

Create an instance: `local county = client:County(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `code` | `string` | County code, as judet takes it. |
| `communes` | `number` | Communes, towns and cities in this county. |
| `name` | `string` | County name. |
| `random` | `string` | Link to a random place in this county. |
| `villages` | `number` | Places in the register in this county. |

#### Example: List

```lua
local countys, err = client:County():list()
```


### Fake

Create an instance: `local fake = client:Fake(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `table` | A machine-made village name (order-3 character Markov chain trained on the real names, filtered against the register). |
| `meta` | `table` |  |

#### Example: Load

```lua
local fake, err = client:Fake():load()
```


### Quiz

Create an instance: `local quiz = client:Quiz(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `a` | `string` | Name in slot a. |
| `answer` | `string` | The slot holding the real place. |
| `b` | `string` | Name in slot b. |
| `correct` | `boolean` | Whether the guess was right. |
| `fake` | `table` | The made-up name. |
| `guess` | `string` | The guess. |
| `id` | `string` |  |
| `permalink` | `string` | Link that reproduces this quiz. |
| `play_again` | `string` | Link to a fresh quiz. |
| `question` | `string` | The question, in English. |
| `quip` | `string` | A remark, in English. |
| `real` | `table` | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `string` | The seed; the same seed always gives the same quiz. |
| `token` | `string` | The quiz itself, signed (base64url payload plus HMAC). |

#### Example: Load

```lua
local quiz, err = client:Quiz():load({ id = "quiz_id", guess = "guess" })
```


### Random

Create an instance: `local random = client:Random(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `table` | The administrative unit the place belongs to. |
| `coordinates` | `table` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `table` | The county. |
| `exists` | `boolean` | Always true for a real place. |
| `is_seat` | `boolean` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `number` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | The commune and county in words. |

#### Example: Load

```lua
local random, err = client:Random():load()
```


### Sate

Create an instance: `local sate = client:Sate(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `communes` | `number` | Communes, towns and cities. |
| `counties` | `number` | Counties, București included. |
| `endpoints` | `table` | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `number` | Distinct real names the fake-name machine learned from. |
| `source` | `string` | Data sources and licences. |
| `villages` | `number` | Real places in the register. |

#### Example: Load

```lua
local sate, err = client:Sate():load()
```


### Search

Create an instance: `local search = client:Search(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `table` | The administrative unit the place belongs to. |
| `coordinates` | `table` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `table` | The county. |
| `exists` | `boolean` | Always true for a real place. |
| `is_seat` | `boolean` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `number` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | The commune and county in words. |

#### Example: List

```lua
local searchs, err = client:Search():list({ q = "example" })
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

Features are the extension mechanism. A feature is a Lua table
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as tables

The Lua SDK uses plain Lua tables throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a table.

### Module structure

```
lua/
├── real-or-fake-village_sdk.lua    -- Main SDK module
├── config.lua               -- Configuration
├── schema.lua               -- Generated option + entity specs
├── features.lua             -- Feature factory
├── core/                    -- Core types and context
├── entity/                  -- Entity implementations
├── feature/                 -- Built-in features (Base, Test, Log)
├── utility/                 -- Utility functions and struct library
└── test/                    -- Test suites
```

The main module (`real-or-fake-village_sdk`) exports the SDK constructor
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```lua
local random = client:Random()
random:load()

-- random:data_get() now returns the random data from the last load
-- random:match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
