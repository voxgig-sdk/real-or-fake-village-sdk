# RealOrFakeVillage Lua SDK Reference

Complete API reference for the RealOrFakeVillage Lua SDK.


## RealOrFakeVillageSDK

### Constructor

```lua
local sdk = require("real-or-fake-village_sdk")
local client = sdk.new(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `table` | SDK configuration options. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `table` | Custom headers for all requests. |
| `options.feature` | `table` | Feature configuration. |
| `options.system` | `table` | System overrides (e.g. custom fetch). |


### Static Methods

#### `sdk.test(testopts?, sdkopts?)`

Create a test client with mock features active. Both arguments are optional.

```lua
local client = sdk.test()
```


### Instance Methods

#### `County(data)`

Create a new `County` entity instance. Pass `nil` for no initial data.

#### `Fake(data)`

Create a new `Fake` entity instance. Pass `nil` for no initial data.

#### `Quiz(data)`

Create a new `Quiz` entity instance. Pass `nil` for no initial data.

#### `Random(data)`

Create a new `Random` entity instance. Pass `nil` for no initial data.

#### `Sate(data)`

Create a new `Sate` entity instance. Pass `nil` for no initial data.

#### `Search(data)`

Create a new `Search` entity instance. Pass `nil` for no initial data.

#### `options_map() -> table`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs) -> table, err`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `"GET"`). |
| `fetchargs.params` | `table` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `table` | Query string parameters. |
| `fetchargs.headers` | `table` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (tables are JSON-serialized). |
| `fetchargs.ctrl` | `table` | Control options (e.g. `{ explain = true }`). |

**Returns:** `table, err`

#### `prepare(fetchargs) -> table, err`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `table, err`


---

## CountyEntity

```lua
local county = client:County(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `string` | Yes | County code, as judet takes it. |
| `communes` | `number` | Yes | Communes, towns and cities in this county. |
| `name` | `string` | Yes | County name. |
| `random` | `string` | Yes | Link to a random place in this county. |
| `villages` | `number` | Yes | Places in the register in this county. |

### Operations

#### `list(reqmatch, ctrl) -> any, err`

List entities matching the given criteria. Returns an array of entities, one per record, or `nil` and an error on failure.

```lua
local results, err = client:County():list()
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `CountyEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## FakeEntity

```lua
local fake = client:Fake(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `exists` | `boolean` | Yes | Always false. |
| `name` | `string` | Yes | A made-up village name that is nowhere in the register. |
| `permalink` | `string` | Yes | Link that reproduces this name. |
| `seed` | `string` | Yes | The seed; the same seed always gives the same name. |
| `sign` | `string` | Yes | Link to its entry sign (SVG image). |

### Operations

#### `load(reqmatch, ctrl) -> any, err`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, or `nil` and an error on failure.

```lua
local result, err = client:Fake():load()
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `FakeEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## QuizEntity

```lua
local quiz = client:Quiz(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `a` | `string` | Yes | Name in slot a. |
| `answer` | `string` | Yes | The slot holding the real place. |
| `b` | `string` | Yes | Name in slot b. |
| `correct` | `boolean` | Yes | Whether the guess was right. |
| `fake` | `table` | Yes | The made-up name. |
| `guess` | `string` | Yes | The guess. |
| `id` | `string` | No |  |
| `permalink` | `string` | Yes | Link that reproduces this quiz. |
| `play_again` | `string` | Yes | Link to a fresh quiz. |
| `question` | `string` | Yes | The question, in English. |
| `quip` | `string` | Yes | A remark, in English. |
| `real` | `table` | Yes | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `string` | Yes | The seed; the same seed always gives the same quiz. |
| `token` | `string` | Yes | The quiz itself, signed (base64url payload plus HMAC). |

### Operations

#### `load(reqmatch, ctrl) -> any, err`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, or `nil` and an error on failure.

```lua
local result, err = client:Quiz():load({ id = "quiz_id", guess = "guess" })
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `QuizEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## RandomEntity

```lua
local random = client:Random(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commune` | `table` | Yes | The administrative unit the place belongs to. |
| `coordinates` | `table` | Yes | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `table` | Yes | The county. |
| `exists` | `boolean` | Yes | Always true for a real place. |
| `is_seat` | `boolean` | Yes | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | Yes | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Yes | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Yes | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `number` | Yes | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | Yes | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | No | The commune and county in words. |

### Operations

#### `load(reqmatch, ctrl) -> any, err`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, or `nil` and an error on failure.

```lua
local result, err = client:Random():load()
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `RandomEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## SateEntity

```lua
local sate = client:Sate(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `communes` | `number` | Yes | Communes, towns and cities. |
| `counties` | `number` | Yes | Counties, București included. |
| `endpoints` | `table` | Yes | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `number` | Yes | Distinct real names the fake-name machine learned from. |
| `source` | `string` | Yes | Data sources and licences. |
| `villages` | `number` | Yes | Real places in the register. |

### Operations

#### `load(reqmatch, ctrl) -> any, err`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, or `nil` and an error on failure.

```lua
local result, err = client:Sate():load()
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `SateEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## SearchEntity

```lua
local search = client:Search(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commune` | `table` | Yes | The administrative unit the place belongs to. |
| `coordinates` | `table` | Yes | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `table` | Yes | The county. |
| `exists` | `boolean` | Yes | Always true for a real place. |
| `is_seat` | `boolean` | Yes | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | Yes | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Yes | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Yes | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `number` | Yes | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | Yes | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | No | The commune and county in words. |

### Operations

#### `list(reqmatch, ctrl) -> any, err`

List entities matching the given criteria. Returns an array of entities, one per record, or `nil` and an error on failure.

```lua
local results, err = client:Search():list({ q = "example" })
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `SearchEntity` instance with the same client and
options.

#### `get_name() -> string`

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

```lua
local client = sdk.new({
  feature = {
    ratelimit = { active = true },
    retry = { active = true },
    test = { active = true },
    timeout = { active = true },
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

