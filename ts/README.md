# RealOrFakeVillage TypeScript SDK



The TypeScript SDK for the RealOrFakeVillage API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.County()` — each with a small set of operations (`list`, `load`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.

> Also generated from this model: `go`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb` — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/real-or-fake-village-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/real-or-fake-village-sdk
npm install ./real-or-fake-village-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { RealOrFakeVillageSDK } from '@voxgig-sdk/real-or-fake-village-sdk'

const client = new RealOrFakeVillageSDK()
```

### 2. List county records

`list()` resolves to an array of County ENTITIES — every operation
resolves to entities, not raw records. Iterate them directly, and call
`.data()` on one for the record it holds:

```ts
const countys = await client.County().list()

for (const county of countys) {
  console.log(county.data())
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const random = await client.Random().load()
  console.log(random.data())
} catch (err) {
  console.error('load failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = RealOrFakeVillageSDK.test()

const random = await client.Random().load()
// random is the Random entity; .data() reads its mock record
console.log(random.data())
```

You can also use the instance method:

```ts
const client = new RealOrFakeVillageSDK()
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Random()

// First call runs the operation and stores its result
await entity.load()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new RealOrFakeVillageSDK({
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
REAL_OR_FAKE_VILLAGE_TEST_LIVE=TRUE
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### RealOrFakeVillageSDK

#### Constructor

```ts
new RealOrFakeVillageSDK(options?: {
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `County(data?)` | `CountyEntity` | Create a County entity instance. |
| `Fake(data?)` | `FakeEntity` | Create a Fake entity instance. |
| `Quiz(data?)` | `QuizEntity` | Create a Quiz entity instance. |
| `Random(data?)` | `RandomEntity` | Create a Random entity instance. |
| `Sate(data?)` | `SateEntity` | Create a Sate entity instance. |
| `Search(data?)` | `SearchEntity` | Create a Search entity instance. |
| `tester(testopts?, sdkopts?)` | `RealOrFakeVillageSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `RealOrFakeVillageSDK.test(testopts?, sdkopts?)` | `RealOrFakeVillageSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): RealOrFakeVillageSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load` resolves to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### County

| Field | Description |
| --- | --- |
| `code` | County code, as judet takes it. |
| `communes` | Communes, towns and cities in this county. |
| `name` | County name. |
| `random` | Link to a random place in this county. |
| `villages` | Places in the register in this county. |

Operations: list.

API path: `/sate/counties`

#### Fake

| Field | Description |
| --- | --- |
| `data` | A machine-made village name (order-3 character Markov chain trained on the real names, filtered against the register). |
| `meta` |  |

Operations: load.

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

Operations: load.

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

Operations: load.

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

Operations: load.

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

Operations: list.

API path: `/sate/search`



## Entities


### County

Create an instance: `const county = client.County()`

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

```ts
const countys = await client.County().list()
```


### Fake

Create an instance: `const fake = client.Fake()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `Record<string, any>` | A machine-made village name (order-3 character Markov chain trained on the real names, filtered against the register). |
| `meta` | `Record<string, any>` |  |

#### Example: Load

```ts
const fake = await client.Fake().load()
```


### Quiz

Create an instance: `const quiz = client.Quiz()`

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
| `fake` | `Record<string, any>` | The made-up name. |
| `guess` | `string` | The guess. |
| `id` | `string` |  |
| `permalink` | `string` | Link that reproduces this quiz. |
| `play_again` | `string` | Link to a fresh quiz. |
| `question` | `string` | The question, in English. |
| `quip` | `string` | A remark, in English. |
| `real` | `Record<string, any>` | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `string` | The seed; the same seed always gives the same quiz. |
| `token` | `string` | The quiz itself, signed (base64url payload plus HMAC). |

#### Example: Load

```ts
const quiz = await client.Quiz().load({ id: 'quiz_id', guess: 'guess' })
```


### Random

Create an instance: `const random = client.Random()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `Record<string, any>` | The administrative unit the place belongs to. |
| `coordinates` | `Record<string, any>` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `Record<string, any>` | The county. |
| `exists` | `boolean` | Always true for a real place. |
| `is_seat` | `boolean` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `number` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | The commune and county in words. |

#### Example: Load

```ts
const random = await client.Random().load()
```


### Sate

Create an instance: `const sate = client.Sate()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `communes` | `number` | Communes, towns and cities. |
| `counties` | `number` | Counties, București included. |
| `endpoints` | `Record<string, any>` | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `number` | Distinct real names the fake-name machine learned from. |
| `source` | `string` | Data sources and licences. |
| `villages` | `number` | Real places in the register. |

#### Example: Load

```ts
const sate = await client.Sate().load()
```


### Search

Create an instance: `const search = client.Search()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `commune` | `Record<string, any>` | The administrative unit the place belongs to. |
| `coordinates` | `Record<string, any>` | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `Record<string, any>` | The county. |
| `exists` | `boolean` | Always true for a real place. |
| `is_seat` | `boolean` | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `number` | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | The commune and county in words. |

#### Example: List

```ts
const searchs = await client.Search().list({ q: "example" })
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

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
real-or-fake-village/
├── src/
│   ├── RealOrFakeVillageSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { RealOrFakeVillageSDK } from '@voxgig-sdk/real-or-fake-village-sdk'
```

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const random = client.Random()
await random.load()

// random.data() now returns the random data from the last `load`
// random.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
