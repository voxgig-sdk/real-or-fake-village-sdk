# RealOrFakeVillage Ruby SDK Reference

Complete API reference for the RealOrFakeVillage Ruby SDK.


## RealOrFakeVillageSDK

### Constructor

```ruby
require_relative 'RealOrFakeVillage_sdk'

client = RealOrFakeVillageSDK.new(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `Hash` | SDK configuration options. |
| `options["base"]` | `String` | Base URL for API requests. |
| `options["prefix"]` | `String` | URL prefix appended after base. |
| `options["suffix"]` | `String` | URL suffix appended after path. |
| `options["headers"]` | `Hash` | Custom headers for all requests. |
| `options["feature"]` | `Hash` | Feature configuration. |
| `options["system"]` | `Hash` | System overrides (e.g. custom fetch). |


### Static Methods

#### `RealOrFakeVillageSDK.test(testopts = nil, sdkopts = nil)`

Create a test client with mock features active. Both arguments may be `nil`.

```ruby
client = RealOrFakeVillageSDK.test
```


### Instance Methods

#### `County(data = nil)`

Create a new `County` entity instance. Pass `nil` for no initial data.

#### `Fake(data = nil)`

Create a new `Fake` entity instance. Pass `nil` for no initial data.

#### `Quiz(data = nil)`

Create a new `Quiz` entity instance. Pass `nil` for no initial data.

#### `Random(data = nil)`

Create a new `Random` entity instance. Pass `nil` for no initial data.

#### `Sate(data = nil)`

Create a new `Sate` entity instance. Pass `nil` for no initial data.

#### `Search(data = nil)`

Create a new `Search` entity instance. Pass `nil` for no initial data.

#### `options_map -> Hash`

Return a deep copy of the current SDK options.

#### `get_utility -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs = {}) -> Hash`

Make a direct HTTP request to any API endpoint. Returns a result hash
(`{ "ok" => ..., "status" => ..., "data" => ..., "err" => ... }`); it
does not raise — inspect `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `String` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `String` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `Hash` | Path parameter values for `{param}` substitution. |
| `fetchargs["query"]` | `Hash` | Query string parameters. |
| `fetchargs["headers"]` | `Hash` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (hashes are JSON-serialized). |
| `fetchargs["ctrl"]` | `Hash` | Control options (e.g. `{ "explain" => true }`). |

**Returns:** `Hash`

#### `prepare(fetchargs = {}) -> Hash`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`. Raises on error.

**Returns:** `Hash` (the fetch definition; raises on error)


---

## CountyEntity

```ruby
county = client.County
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `String` | Yes | County code, as judet takes it. |
| `communes` | `Integer` | Yes | Communes, towns and cities in this county. |
| `name` | `String` | Yes | County name. |
| `random` | `String` | Yes | Link to a random place in this county. |
| `villages` | `Integer` | Yes | Places in the register in this county. |

### Operations

#### `list(reqmatch = nil, ctrl = nil) -> Array`

List entities matching the given criteria (call with no argument to list all). Returns an array of entities, one per record; `data_get` reads each record. Raises on error.

```ruby
results = client.County.list
results.each { |item| puts item.data_get }
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `CountyEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## FakeEntity

```ruby
fake = client.Fake
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `exists` | `Boolean` | Yes | Always false. |
| `name` | `String` | Yes | A made-up village name that is nowhere in the register. |
| `permalink` | `String` | Yes | Link that reproduces this name. |
| `seed` | `String` | Yes | The seed; the same seed always gives the same name. |
| `sign` | `String` | Yes | Link to its entry sign (SVG image). |

### Operations

#### `load(reqmatch, ctrl = nil) -> result`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get` reads, and raises on error.

```ruby
result = client.Fake.load()
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `FakeEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## QuizEntity

```ruby
quiz = client.Quiz
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `a` | `String` | Yes | Name in slot a. |
| `answer` | `String` | Yes | The slot holding the real place. |
| `b` | `String` | Yes | Name in slot b. |
| `correct` | `Boolean` | Yes | Whether the guess was right. |
| `fake` | `Hash` | Yes | The made-up name. |
| `guess` | `String` | Yes | The guess. |
| `id` | `String` | No |  |
| `permalink` | `String` | Yes | Link that reproduces this quiz. |
| `play_again` | `String` | Yes | Link to a fresh quiz. |
| `question` | `String` | Yes | The question, in English. |
| `quip` | `String` | Yes | A remark, in English. |
| `real` | `Hash` | Yes | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `String` | Yes | The seed; the same seed always gives the same quiz. |
| `token` | `String` | Yes | The quiz itself, signed (base64url payload plus HMAC). |

### Operations

#### `load(reqmatch, ctrl = nil) -> result`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get` reads, and raises on error.

```ruby
result = client.Quiz.load({ "id" => "quiz_id", "guess" => "guess" })
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `QuizEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## RandomEntity

```ruby
random = client.Random
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commune` | `Hash` | Yes | The administrative unit the place belongs to. |
| `coordinates` | `Hash` | Yes | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `Hash` | Yes | The county. |
| `exists` | `Boolean` | Yes | Always true for a real place. |
| `is_seat` | `Boolean` | Yes | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `String` | Yes | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `String` | Yes | Place name, in proper case with comma-below ș and ț. |
| `sign` | `String` | Yes | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `Integer` | Yes | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `String` | Yes | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `String` | No | The commune and county in words. |

### Operations

#### `load(reqmatch, ctrl = nil) -> result`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get` reads, and raises on error.

```ruby
result = client.Random.load()
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `RandomEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## SateEntity

```ruby
sate = client.Sate
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `communes` | `Integer` | Yes | Communes, towns and cities. |
| `counties` | `Integer` | Yes | Counties, București included. |
| `endpoints` | `Hash` | Yes | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `Integer` | Yes | Distinct real names the fake-name machine learned from. |
| `source` | `String` | Yes | Data sources and licences. |
| `villages` | `Integer` | Yes | Real places in the register. |

### Operations

#### `load(reqmatch, ctrl = nil) -> result`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get` reads, and raises on error.

```ruby
result = client.Sate.load()
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `SateEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## SearchEntity

```ruby
search = client.Search
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commune` | `Hash` | Yes | The administrative unit the place belongs to. |
| `coordinates` | `Hash` | Yes | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `Hash` | Yes | The county. |
| `exists` | `Boolean` | Yes | Always true for a real place. |
| `is_seat` | `Boolean` | Yes | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `String` | Yes | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `String` | Yes | Place name, in proper case with comma-below ș and ț. |
| `sign` | `String` | Yes | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `Integer` | Yes | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `String` | Yes | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `String` | No | The commune and county in words. |

### Operations

#### `list(reqmatch = nil, ctrl = nil) -> Array`

List entities matching the given criteria (call with no argument to list all). Returns an array of entities, one per record; `data_get` reads each record. Raises on error.

```ruby
results = client.Search.list({ "q" => "example" })
results.each { |item| puts item.data_get }
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `SearchEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `ratelimit` | 0.0.1 | Rate limiting |
| `retry` | 0.0.1 | Retry |
| `test` | 0.0.1 | Test transport |
| `timeout` | 0.0.1 | Timeout |


Features are activated via the `feature` option:

```ruby
client = RealOrFakeVillageSDK.new({
  "feature" => {
    "ratelimit" => { "active" => true },
    "retry" => { "active" => true },
    "test" => { "active" => true },
    "timeout" => { "active" => true },
  },
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### Ordering

`ratelimit`, `retry`, `timeout` wrap the transport. Each
wraps whatever is already installed, so **activation order is nesting order**:
a feature activated later sits OUTSIDE one activated earlier, and sees the call
first.

That decides behaviour, not just sequence: a feature that short-circuits the
call, such as a cache serving a hit, stops every feature nested inside it from
ever seeing that call.

`test` attach to pipeline hooks
rather than the transport, so their order does not affect what they observe.

#### `ratelimit`

Rate limiting.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

| Option | Type |
|---|---|
| `now` | function |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.ratelimit.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `retry`

Retry.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

| Option | Type |
|---|---|
| `jitter` | boolean |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.retry.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

#### `timeout`

Timeout.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

| Option | Type |
|---|---|
| `clearTimer` | function |
| `now` | function |
| `setTimer` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.timeout.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

