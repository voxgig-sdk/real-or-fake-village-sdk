# RealOrFakeVillage TypeScript SDK Reference

Complete API reference for the RealOrFakeVillage TypeScript SDK.


## RealOrFakeVillageSDK

### Constructor

```ts
new RealOrFakeVillageSDK(options?: object)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | SDK configuration options. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `object` | Custom headers for all requests. |
| `options.feature` | `object` | Feature configuration. |
| `options.system` | `object` | System overrides (e.g. custom fetch). |


### Static Methods

#### `RealOrFakeVillageSDK.test(testopts?, sdkopts?)`

Create a test client with mock features active.

```ts
const client = RealOrFakeVillageSDK.test()
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `testopts` | `object` | Test feature options. |
| `sdkopts` | `object` | Additional SDK options merged with test defaults. |

**Returns:** `RealOrFakeVillageSDK` instance in test mode.


### Instance Methods

#### `County(data?: object)`

Create a new `County` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `CountyEntity` instance.

#### `Fake(data?: object)`

Create a new `Fake` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `FakeEntity` instance.

#### `Quiz(data?: object)`

Create a new `Quiz` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `QuizEntity` instance.

#### `Random(data?: object)`

Create a new `Random` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `RandomEntity` instance.

#### `Sate(data?: object)`

Create a new `Sate` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SateEntity` instance.

#### `Search(data?: object)`

Create a new `Search` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SearchEntity` instance.

#### `options()`

Return a deep copy of the current SDK options.

**Returns:** `object`

#### `utility()`

Return a copy of the SDK utility object.

**Returns:** `object`

#### `direct(fetchargs?: object)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `GET`). |
| `fetchargs.params` | `object` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `object` | Query string parameters. |
| `fetchargs.headers` | `object` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (objects are JSON-serialized). |
| `fetchargs.ctrl` | `object` | Control options (e.g. `{ explain: true }`). |
| `fetchargs.ctrl.signal` | `AbortSignal` | Aborts the request in flight: `ok` is then `false` and `err.code` is `request_aborted`. |

**Returns:** `Promise<{ ok, status, headers, data }>`. On a failure
`ok` is `false` and `err` holds the error.

#### `prepare(fetchargs?: object)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `Promise<{ url, method, headers, body } | Error>`

#### `tester(testopts?, sdkopts?)`

Alias for `RealOrFakeVillageSDK.test()`.

**Returns:** `RealOrFakeVillageSDK` instance in test mode.

#### Cancelling a call

Every entity operation takes an optional `ctrl` object after its match or
data, and an `AbortSignal` in `ctrl.signal` cancels the request in flight.
The operation then rejects with an error whose `code` is
`request_aborted` and whose `cause` is the signal's reason. A request
whose signal has already aborted is not sent. `stream()` takes the signal
as `callopts.signal`, and ends when it aborts.


---

## CountyEntity

```ts
const county = client.County()
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

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.County().list()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `CountyEntity` instance with the same client and
options.

#### `client()`

Return the parent `RealOrFakeVillageSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## FakeEntity

```ts
const fake = client.Fake()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `Record<string, any>` | Yes | A machine-made village name (order-3 character Markov chain trained on the real names, filtered against the register). |
| `meta` | `Record<string, any>` | Yes |  |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Fake().load()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `FakeEntity` instance with the same client and
options.

#### `client()`

Return the parent `RealOrFakeVillageSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## QuizEntity

```ts
const quiz = client.Quiz()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `a` | `string` | Yes | Name in slot a. |
| `answer` | `string` | Yes | The slot holding the real place. |
| `b` | `string` | Yes | Name in slot b. |
| `correct` | `boolean` | Yes | Whether the guess was right. |
| `fake` | `Record<string, any>` | Yes | The made-up name. |
| `guess` | `string` | Yes | The guess. |
| `id` | `string` | No |  |
| `permalink` | `string` | Yes | Link that reproduces this quiz. |
| `play_again` | `string` | Yes | Link to a fresh quiz. |
| `question` | `string` | Yes | The question, in English. |
| `quip` | `string` | Yes | A remark, in English. |
| `real` | `Record<string, any>` | Yes | A real place from SIRUTA, the Romanian register of localities. |
| `seed` | `string` | Yes | The seed; the same seed always gives the same quiz. |
| `token` | `string` | Yes | The quiz itself, signed (base64url payload plus HMAC). |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Quiz().load({ id: 'quiz_id', guess: 'guess' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `QuizEntity` instance with the same client and
options.

#### `client()`

Return the parent `RealOrFakeVillageSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## RandomEntity

```ts
const random = client.Random()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commune` | `Record<string, any>` | Yes | The administrative unit the place belongs to. |
| `coordinates` | `Record<string, any>` | Yes | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `Record<string, any>` | Yes | The county. |
| `exists` | `boolean` | Yes | Always true for a real place. |
| `is_seat` | `boolean` | Yes | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | Yes | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Yes | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Yes | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `number` | Yes | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | Yes | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | No | The commune and county in words. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Random().load()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `RandomEntity` instance with the same client and
options.

#### `client()`

Return the parent `RealOrFakeVillageSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SateEntity

```ts
const sate = client.Sate()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `communes` | `number` | Yes | Communes, towns and cities. |
| `counties` | `number` | Yes | Counties, București included. |
| `endpoints` | `Record<string, any>` | Yes | Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign). |
| `fake_names_learned_from` | `number` | Yes | Distinct real names the fake-name machine learned from. |
| `source` | `string` | Yes | Data sources and licences. |
| `villages` | `number` | Yes | Real places in the register. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Sate().load()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SateEntity` instance with the same client and
options.

#### `client()`

Return the parent `RealOrFakeVillageSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SearchEntity

```ts
const search = client.Search()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commune` | `Record<string, any>` | Yes | The administrative unit the place belongs to. |
| `coordinates` | `Record<string, any>` | Yes | Where it is, from Wikidata; documented as null for the few places Wikidata has no point for. |
| `county` | `Record<string, any>` | Yes | The county. |
| `exists` | `boolean` | Yes | Always true for a real place. |
| `is_seat` | `boolean` | Yes | True for the village that is the seat of its commune, and for the main place of a town or city. |
| `map` | `string` | Yes | OpenStreetMap link to the coordinates; documented as null when there are none. |
| `name` | `string` | Yes | Place name, in proper case with comma-below ș and ț. |
| `sign` | `string` | Yes | Link to the place's entry sign (SVG image, not JSON). |
| `siruta` | `number` | Yes | The place's code in SIRUTA, the national register; tells apart places that share a name. |
| `type` | `string` | Yes | sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own). |
| `where` | `string` | No | The commune and county in words. |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Search().list({ q: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SearchEntity` instance with the same client and
options.

#### `client()`

Return the parent `RealOrFakeVillageSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `ratelimit` | 0.0.1 | Rate limiting |
| `retry` | 0.0.1 | Retry |
| `test` | 0.0.1 | Test transport |
| `timeout` | 0.0.1 | Timeout |


Features are activated via the `feature` option:

```ts
const client = new RealOrFakeVillageSDK({
  feature: {
    ratelimit: { active: true },
    retry: { active: true },
    test: { active: true },
    timeout: { active: true },
  }
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

