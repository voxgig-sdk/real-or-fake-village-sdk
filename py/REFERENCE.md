# RealOrFakeVillage Python SDK Reference

Complete API reference for the RealOrFakeVillage Python SDK.


## RealOrFakeVillageSDK

### Constructor

```python
from realorfakevillage_sdk import RealOrFakeVillageSDK

client = RealOrFakeVillageSDK(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `dict` | SDK configuration options. |
| `options["base"]` | `str` | Base URL for API requests. |
| `options["prefix"]` | `str` | URL prefix appended after base. |
| `options["suffix"]` | `str` | URL suffix appended after path. |
| `options["headers"]` | `dict` | Custom headers for all requests. |
| `options["feature"]` | `dict` | Feature configuration. |
| `options["system"]` | `dict` | System overrides (e.g. custom fetch). |


### Static Methods

#### `RealOrFakeVillageSDK.test(testopts=None, sdkopts=None)`

Create a test client with mock features active. Both arguments may be `None`.

```python
client = RealOrFakeVillageSDK.test()
```


### Instance Methods

#### `County(data=None)`

Create a new `CountyEntity` instance. Pass `None` for no initial data.

#### `Fake(data=None)`

Create a new `FakeEntity` instance. Pass `None` for no initial data.

#### `Quiz(data=None)`

Create a new `QuizEntity` instance. Pass `None` for no initial data.

#### `Random(data=None)`

Create a new `RandomEntity` instance. Pass `None` for no initial data.

#### `Sate(data=None)`

Create a new `SateEntity` instance. Pass `None` for no initial data.

#### `Search(data=None)`

Create a new `SearchEntity` instance. Pass `None` for no initial data.

#### `options_map() -> dict`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs=None) -> dict`

Make a direct HTTP request to any API endpoint. Returns a result `dict` with `ok`, `status`, `headers`, and `data` (or `err` on failure). This escape hatch never raises — branch on `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `str` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `str` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `dict` | Path parameter values. |
| `fetchargs["query"]` | `dict` | Query string parameters. |
| `fetchargs["headers"]` | `dict` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (dicts are JSON-serialized). |

**Returns:** `result_dict`

#### `prepare(fetchargs=None) -> dict`

Prepare a fetch definition without sending. Returns the `fetchdef` and raises on error.


---

## CountyEntity

```python
county = client.County()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `str` | Yes | County code, as judet takes it. |
| `communes` | `int` | Yes | Communes, towns and cities in this county. |
| `name` | `str` | Yes | County name. |
| `random` | `str` | Yes | Link to a random place in this county. |
| `villages` | `int` | Yes | Places in the register in this county. |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[CountyEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.County().list()
for county in results:
    print(county.data_get())
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `CountyEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## FakeEntity

```python
fake = client.Fake()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `dict` | Yes | A machine-made village name (order-3 character Markov chain trained on the real names, filtered against the register). |
| `meta` | `dict` | Yes |  |

### Operations

#### `load(reqmatch, ctrl=None) -> FakeEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Fake().load()
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `FakeEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## QuizEntity

```python
quiz = client.Quiz()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `a` | `str` | Yes | Name in slot a. |
| `answer` | `str` | Yes | The slot holding the real place. |
| `b` | `str` | Yes | Name in slot b. |
| `correct` | `bool` | Yes | Whether the guess was right. |
| `fake` | `dict` | Yes | The made-up name. |
| `guess` | `str` | Yes | The guess. |
| `id` | `str` | No |  |
| `permalink` | `str` | Yes | Link that reproduces this quiz. |
| `play_again` | `str` | Yes | Link to a fresh quiz. |
| `question` | `str` | Yes | The question, in English. |
| `quip` | `str` | Yes | A remark, in English. |
| `real` | `dict` | Yes | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `str` | Yes | The seed; the same seed always gives the same quiz. |
| `token` | `str` | Yes | The quiz itself, signed (base64url payload plus HMAC). |

### Operations

#### `load(reqmatch, ctrl=None) -> QuizEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Quiz().load({"id": "quiz_id", "guess": "guess"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `QuizEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## RandomEntity

```python
random = client.Random()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commune` | `dict` | Yes | The administrative unit the place belongs to. |
| `coordinates` | `dict` | Yes | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `dict` | Yes | The county. |
| `exists` | `bool` | Yes | Always true for a real place. |
| `is_seat` | `bool` | Yes | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `str` | Yes | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `str` | Yes | Place name, in proper case with comma-below ș and ț. |
| `sign` | `str` | Yes | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `int` | Yes | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `str` | Yes | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `str` | No | The commune and county in words. |

### Operations

#### `load(reqmatch, ctrl=None) -> RandomEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Random().load()
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `RandomEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## SateEntity

```python
sate = client.Sate()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `communes` | `int` | Yes | Communes, towns and cities. |
| `counties` | `int` | Yes | Counties, București included. |
| `endpoints` | `dict` | Yes | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `int` | Yes | Distinct real names the fake-name machine learned from. |
| `source` | `str` | Yes | Data sources and licences. |
| `villages` | `int` | Yes | Real places in the register. |

### Operations

#### `load(reqmatch, ctrl=None) -> SateEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Sate().load()
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `SateEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## SearchEntity

```python
search = client.Search()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commune` | `dict` | Yes | The administrative unit the place belongs to. |
| `coordinates` | `dict` | Yes | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `dict` | Yes | The county. |
| `exists` | `bool` | Yes | Always true for a real place. |
| `is_seat` | `bool` | Yes | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `str` | Yes | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `str` | Yes | Place name, in proper case with comma-below ș and ț. |
| `sign` | `str` | Yes | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `int` | Yes | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `str` | Yes | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `str` | No | The commune and county in words. |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[SearchEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Search().list({"q": "example"})
for search in results:
    print(search.data_get())
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `SearchEntity` instance with the same options.

#### `get_name() -> str`

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

```python
client = RealOrFakeVillageSDK({
    "feature": {
        "ratelimit": {"active": True},
        "retry": {"active": True},
        "test": {"active": True},
        "timeout": {"active": True},
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

