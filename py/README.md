# RealOrFakeVillage Python SDK



The Python SDK for the RealOrFakeVillage API — an entity-oriented client following Pythonic conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.County()` — each
carrying a small, uniform set of operations (`list`, `load`) instead of raw URL
paths and query strings. You work with named resources and verbs, which
keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to PyPI. Install it from the GitHub
release tag (`py/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/real-or-fake-village-sdk/tags)) or
from a source checkout:

```bash
pip install -e .
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```python
from realorfakevillage_sdk import RealOrFakeVillageSDK

client = RealOrFakeVillageSDK()
```

### 2. List county records

`list()` returns a `list` of entities, one per record, and raises on
error; an entity's `data_get()` reads its record (a `dict`).

```python
try:
    countys = client.County().list()
    for county in countys:
        print(county.data_get())
except Exception as err:
    print(f"list failed: {err}")
```


## Error handling

Entity operations raise on failure, so wrap them in `try` / `except`:

```python
try:
    random = client.Random().load()
    print(random.data_get())
except Exception as err:
    print(f"load failed: {err}")
```

`direct()` does **not** raise — it returns the result envelope. Branch
on `ok`; on failure `status` holds the HTTP status (for error responses)
and `err` holds a transport error, so read both defensively:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example_id"},
})

if not result["ok"]:
    print("request failed:", result.get("status"), result.get("err"))
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
})

if result["ok"]:
    print(result["status"])  # 200
    print(result["data"])    # response body
else:
    # A non-2xx response carries status + data (the error body); a
    # transport-level failure carries err instead. Only one is present, so
    # read both with .get() rather than indexing a key that may be absent.
    print(result.get("status"), result.get("err"))
```

### Prepare a request without sending it

```python
# prepare() returns the fetch definition and raises on error.
fetchdef = client.prepare({
    "path": "/api/resource/{id}",
    "method": "DELETE",
    "params": {"id": "example"},
})

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```python
client = RealOrFakeVillageSDK.test()

# Entity ops return the entity, and list one per record; they raise on error.
random = client.Random().load()
# data_get() on an entity reads its mock response record
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```python
def mock_fetch(url, init):
    return {
        "status": 200,
        "statusText": "OK",
        "headers": {},
        "json": lambda: {"id": "mock01"},
    }, None

client = RealOrFakeVillageSDK({
    "base": "http://localhost:8080",
    "system": {
        "fetch": mock_fetch,
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
cd py && pytest test/
```


## Reference

### RealOrFakeVillageSDK

```python
from realorfakevillage_sdk import RealOrFakeVillageSDK

client = RealOrFakeVillageSDK(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `str` | Base URL of the API server. |
| `prefix` | `str` | URL path prefix prepended to all requests. |
| `suffix` | `str` | URL path suffix appended to all requests. |
| `feature` | `dict` | Feature activation flags. |
| `extend` | `list` | Additional Feature instances to load. |
| `system` | `dict` | System overrides (e.g. custom `fetch` function). |

### test

```python
client = RealOrFakeVillageSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `None`.

### RealOrFakeVillageSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> dict` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> dict` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> dict` | Build and send an HTTP request. Returns a result dict (branch on `ok`). |
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
| `list` | `(reqmatch, ctrl) -> list` | List entities matching the criteria, one per record. Raises on error. |
| `data_get` | `() -> dict` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> dict` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> str` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` a `list` of entities, one
per record; an entity's `data_get()` reads its record (a `dict`). They raise
on error, so wrap calls in `try`/`except` to handle failures.

The `direct()` escape hatch never raises — it returns a result `dict`
you branch on via `result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `True` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `dict` | Response headers. |
| `data` | `any` | Parsed JSON response body. |

On error, `ok` is `False` and `err` contains the error value.

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

Create an instance: `county = client.County()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `code` | `str` | County code, as judet takes it. |
| `communes` | `int` | Communes, towns and cities in this county. |
| `name` | `str` | County name. |
| `random` | `str` | Link to a random place in this county. |
| `villages` | `int` | Places in the register in this county. |

#### Example: List

```python
countys = client.County().list()
```


### Fake

Create an instance: `fake = client.Fake()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `dict` | A machine-made village name (order-3 character Markov chain trained on the real names, filtered against the register). |
| `meta` | `dict` |  |

#### Example: Load

```python
fake = client.Fake().load()
```


### Quiz

Create an instance: `quiz = client.Quiz()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `a` | `str` | Name in slot a. |
| `answer` | `str` | The slot holding the real place. |
| `b` | `str` | Name in slot b. |
| `correct` | `bool` | Whether the guess was right. |
| `fake` | `dict` | The made-up name. |
| `guess` | `str` | The guess. |
| `id` | `str` |  |
| `permalink` | `str` | Link that reproduces this quiz. |
| `play_again` | `str` | Link to a fresh quiz. |
| `question` | `str` | The question, in English. |
| `quip` | `str` | A remark, in English. |
| `real` | `dict` | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `str` | The seed; the same seed always gives the same quiz. |
| `token` | `str` | The quiz itself, signed (base64url payload plus HMAC). |

#### Example: Load

```python
quiz = client.Quiz().load({"id": "quiz_id", "guess": "guess"})
```


### Random

Create an instance: `random = client.Random()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `dict` | The administrative unit the place belongs to. |
| `coordinates` | `dict` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `dict` | The county. |
| `exists` | `bool` | Always true for a real place. |
| `is_seat` | `bool` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `str` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `str` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `str` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `int` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `str` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `str` | The commune and county in words. |

#### Example: Load

```python
random = client.Random().load()
```


### Sate

Create an instance: `sate = client.Sate()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `communes` | `int` | Communes, towns and cities. |
| `counties` | `int` | Counties, București included. |
| `endpoints` | `dict` | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `int` | Distinct real names the fake-name machine learned from. |
| `source` | `str` | Data sources and licences. |
| `villages` | `int` | Real places in the register. |

#### Example: Load

```python
sate = client.Sate().load()
```


### Search

Create an instance: `search = client.Search()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `dict` | The administrative unit the place belongs to. |
| `coordinates` | `dict` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `dict` | The county. |
| `exists` | `bool` | Always true for a real place. |
| `is_seat` | `bool` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `str` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `str` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `str` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `int` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `str` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `str` | The commune and county in words. |

#### Example: List

```python
searchs = client.Search().list({"q": "example"})
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

Features are the extension mechanism. A feature is a Python class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as dicts

The Python SDK uses plain dicts throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a dict.

### Module structure

```
py/
├── realorfakevillage_sdk.py         -- Main SDK module
├── config.py                    -- Configuration
├── schema.py                    -- Generated option + entity specs
├── features.py                  -- Feature factory
├── core/                        -- Core types and context
├── entity/                      -- Entity implementations
├── feature/                     -- Built-in features (Base, Test, Log)
├── utility/                     -- Utility functions and struct library
└── test/                        -- Test suites
```

The main module (`realorfakevillage_sdk`) exports the SDK class.
Import entity or utility modules directly only when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```python
random = client.Random()
random.load()

# random.data_get() now returns the random data from the last load
# random.match_get() returns the last match criteria
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
