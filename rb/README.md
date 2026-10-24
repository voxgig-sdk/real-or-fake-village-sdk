# RealOrFakeVillage Ruby SDK



The Ruby SDK for the RealOrFakeVillage API — an entity-oriented client using idiomatic Ruby conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.County` — with named operations (`list`/`load`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to RubyGems. Install it from the
GitHub release tag (`rb/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/real-or-fake-village-sdk/tags)), or
from a clone:

```bash
git clone https://github.com/voxgig-sdk/real-or-fake-village-sdk
```

Then add it to your `Gemfile` by path, and run `bundle install`:

```ruby
gem "voxgig-sdk-real-or-fake-village-sdk", path: "./real-or-fake-village-sdk/rb"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ruby
require_relative "RealOrFakeVillage_sdk"

client = RealOrFakeVillageSDK.new
```

### 2. List county records

```ruby
begin
  # list returns an Array of County entities, one per record; data_get reads the record.
  countys = client.County.list
  countys.each do |item|
    record = item.data_get
    puts "#{record["code"]}"
  end
rescue => err
  warn "list failed: #{err}"
end
```


## Error handling

Entity operations raise on failure, so rescue them:

```ruby
begin
  random = client.Random.load()
rescue => err
  warn "load failed: #{err}"
end
```

`direct` does **not** raise — it returns the result hash. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example_id" },
})

warn "request failed: #{result["err"] || "HTTP #{result["status"]}"}" unless result["ok"]
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})

if result["ok"]
  puts result["status"]  # 200
  puts result["data"]    # response body
else
  # On an HTTP error status there is no err (only a transport failure sets
  # it), so fall back to the status code.
  warn(result["err"] || "HTTP #{result["status"]}")
end
```

### Prepare a request without sending it

```ruby
begin
  fetchdef = client.prepare({
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => { "id" => "example" },
  })
  puts fetchdef["url"]
  puts fetchdef["method"]
  puts fetchdef["headers"]
rescue => err
  warn "prepare failed: #{err}"
end
```

### Use test mode

Create a mock client for unit testing — no server required:

```ruby
client = RealOrFakeVillageSDK.test

# Entity ops return the ENTITY (raises on error);
# data_get reads its mock record.
random = client.Random.load()
puts random.data_get
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```ruby
mock_fetch = ->(url, init) {
  return {
    "status" => 200,
    "statusText" => "OK",
    "headers" => {},
    "json" => ->() { { "id" => "mock01" } },
  }, nil
}

client = RealOrFakeVillageSDK.new({
  "base" => "http://localhost:8080",
  "system" => {
    "fetch" => mock_fetch,
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
cd rb && ruby -Itest -e "Dir['test/*_test.rb'].each { |f| require_relative f }"
```


## Reference

### RealOrFakeVillageSDK

```ruby
require_relative "RealOrFakeVillage_sdk"
client = RealOrFakeVillageSDK.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `String` | Base URL of the API server. |
| `prefix` | `String` | URL path prefix prepended to all requests. |
| `suffix` | `String` | URL path suffix appended to all requests. |
| `feature` | `Hash` | Feature activation flags. |
| `extend` | `Hash` | Additional Feature instances to load. |
| `system` | `Hash` | System overrides (e.g. custom `fetch` lambda). |

### test

```ruby
client = RealOrFakeVillageSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### RealOrFakeVillageSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> Hash` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> Hash` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> Hash` | Build and send an HTTP request. Returns a result hash (`result["ok"]`); does not raise. |
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
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch = nil, ctrl) -> Array` | List entities matching the criteria (call with no argument to list all), one per record. Raises on error. |
| `data_get` | `() -> Hash` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> Hash` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> String` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `Array` of entities, one
per record; an entity's `data_get` reads its record. On failure they raise a
`RealOrFakeVillageError` (a `StandardError` subclass), so wrap calls in
`begin`/`rescue` where you need to handle errors.

The `direct` escape hatch is the exception: it never raises and instead
returns a result `Hash` with these keys:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `Boolean` | `true` if the HTTP status is 2xx. |
| `status` | `Integer` | HTTP status code. |
| `headers` | `Hash` | Response headers. |
| `data` | `any` | Parsed JSON response body. |
| `err` | `Error` | Present when `ok` is `false`. |

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

Create an instance: `county = client.County`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `code` | `String` | County code, as judet takes it. |
| `communes` | `Integer` | Communes, towns and cities in this county. |
| `name` | `String` | County name. |
| `random` | `String` | Link to a random place in this county. |
| `villages` | `Integer` | Places in the register in this county. |

#### Example: List

```ruby
# list returns an Array of County entities, one per record (raises on error).
countys = client.County.list
countys.each { |item| puts item.data_get }
```


### Fake

Create an instance: `fake = client.Fake`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `Hash` | A machine-made village name (order-3 character Markov chain trained on the real names, filtered against the register). |
| `meta` | `Hash` |  |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Fake record (raises on error).
fake = client.Fake.load()
```


### Quiz

Create an instance: `quiz = client.Quiz`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `a` | `String` | Name in slot a. |
| `answer` | `String` | The slot holding the real place. |
| `b` | `String` | Name in slot b. |
| `correct` | `Boolean` | Whether the guess was right. |
| `fake` | `Hash` | The made-up name. |
| `guess` | `String` | The guess. |
| `id` | `String` |  |
| `permalink` | `String` | Link that reproduces this quiz. |
| `play_again` | `String` | Link to a fresh quiz. |
| `question` | `String` | The question, in English. |
| `quip` | `String` | A remark, in English. |
| `real` | `Hash` | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `String` | The seed; the same seed always gives the same quiz. |
| `token` | `String` | The quiz itself, signed (base64url payload plus HMAC). |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Quiz record (raises on error).
quiz = client.Quiz.load({ "id" => "quiz_id", "guess" => "guess" })
```


### Random

Create an instance: `random = client.Random`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `Hash` | The administrative unit the place belongs to. |
| `coordinates` | `Hash` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `Hash` | The county. |
| `exists` | `Boolean` | Always true for a real place. |
| `is_seat` | `Boolean` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `String` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `String` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `String` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `Integer` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `String` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `String` | The commune and county in words. |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Random record (raises on error).
random = client.Random.load()
```


### Sate

Create an instance: `sate = client.Sate`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `communes` | `Integer` | Communes, towns and cities. |
| `counties` | `Integer` | Counties, București included. |
| `endpoints` | `Hash` | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `Integer` | Distinct real names the fake-name machine learned from. |
| `source` | `String` | Data sources and licences. |
| `villages` | `Integer` | Real places in the register. |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Sate record (raises on error).
sate = client.Sate.load()
```


### Search

Create an instance: `search = client.Search`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `Hash` | The administrative unit the place belongs to. |
| `coordinates` | `Hash` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `Hash` | The county. |
| `exists` | `Boolean` | Always true for a real place. |
| `is_seat` | `Boolean` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `String` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `String` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `String` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `Integer` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `String` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `String` | The commune and county in words. |

#### Example: List

```ruby
# list returns an Array of Search entities, one per record (raises on error).
searchs = client.Search.list({ "q" => "example" })
searchs.each { |item| puts item.data_get }
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

Features are the extension mechanism. A feature is a Ruby class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as hashes

The Ruby SDK uses plain Ruby hashes throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers.to_map()` to safely validate that a value is a hash.

### Module structure

```
rb/
├── RealOrFakeVillage_sdk.rb       -- Main SDK module
├── config.rb                  -- Configuration
├── schema.rb                  -- Generated option + entity specs
├── features.rb                -- Feature factory
├── core/                      -- Core types and context
├── entity/                    -- Entity implementations
├── feature/                   -- Built-in features (Base, Test, Log)
├── utility/                   -- Utility functions and struct library
└── test/                      -- Test suites
```

The main module (`RealOrFakeVillage_sdk`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```ruby
random = client.Random
random.load()

# random.data_get now returns the random data from the last load
# random.match_get returns the last match criteria
```

Call `make` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
