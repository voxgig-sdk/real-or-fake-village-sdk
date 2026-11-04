# Real or Fake Village

> Romanian places, real and made up, from the `api.tasta.space` hub: a quiz pairing one real village name with one machine-made fake, made-up names, random real places, search and the county list. Real places are the 13,750 localities of SIRUTA S1 2026 (Institutul Național de Statistică, CC BY 4.0) with Wikidata coordinates (CC0). Field values are in Romanian, quiz text in English. GET only, JSON in a &#123;&quot;data&quot;: ...&#125; envelope, no key needed (anonymous callers get 30 requests a minute and 1,000 a day per IP, shared across every API on the hub).
>
> Sources: the documentation page https://api.tasta.space/sate and the hub rules at https://api.tasta.space/docs, with every modelled endpoint probed live on 2026-10-23 (overview; seeded and random quiz; both guesses on a seeded token, a forged token and a missing guess; seeded and random fake names; random place in MM; search for fundu; counties).
>
> Not modelled: format=text (one plain-text line, on quiz, quiz/&#123;token&#125;, fake and random) and /sate/sign, which returns an SVG or PNG entry sign rather than JSON. Unverified: null coordinates and map (documented for places Wikidata has no point for; every place probed had them) and the 410 `quiz_expired` error.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 6 entities and 7 HTTP routes. There are 6 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### County

Results: The counties.

SDK operations: `list`.

Key fields to recognise:

- `code`: County code, as judet takes it.
- `communes`: Communes, towns and cities in this county.
- `name`: County name.
- `random`: Link to a random place in this county.
- `villages`: Places in the register in this county.

### Fake

Results: The made-up name.

SDK operations: `load`.

Key fields to recognise:

- `exists`: Always false.
- `name`: A made-up village name that is nowhere in the register.
- `permalink`: Link that reproduces this name.
- `seed`: The seed; the same seed always gives the same name.
- `sign`: Link to its entry sign (SVG image).

### Quiz

Results: The checked guess.; The quiz.

SDK operations: `load`.

Key fields to recognise:

- `a`: Name in slot a.
- `answer`: The slot holding the real place.
- `b`: Name in slot b.
- `correct`: Whether the guess was right.
- `fake`: The made-up name.

### Random

Results: The place.

SDK operations: `load`.

Key fields to recognise:

- `commune`: The administrative unit the place belongs to.
- `coordinates`: Where it is, from Wikidata; documented as null for the few places Wikidata has no point for.
- `county`: The county.
- `exists`: Always true for a real place.
- `is_seat`: True for the village that is the seat of its commune, and for the main place of a town or city.

### Sate

Results: The overview.

SDK operations: `load`.

Key fields to recognise:

- `communes`: Communes, towns and cities.
- `counties`: Counties, București included.
- `endpoints`: Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign).
- `fake_names_learned_from`: Distinct real names the fake-name machine learned from.
- `source`: Data sources and licences.

### Search

Results: A page of places.

SDK operations: `list`.

Key fields to recognise:

- `commune`: The administrative unit the place belongs to.
- `coordinates`: Where it is, from Wikidata; documented as null for the few places Wikidata has no point for.
- `county`: The county.
- `exists`: Always true for a real place.
- `is_seat`: True for the village that is the seat of its commune, and for the main place of a town or city.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| County | `list` | `GET /sate/counties` | See reference |
| Fake | `load` | `GET /sate/fake` | See reference |
| Quiz | `load` | `GET /sate/quiz/{token}` | See reference |
| Quiz | `load` | `GET /sate/quiz` | See reference |
| Random | `load` | `GET /sate/random` | See reference |
| Sate | `load` | `GET /sate` | See reference |
| Search | `list` | `GET /sate/search` | See reference |

## Connect to the API

- API server: `https://api.tasta.space/v1`

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| Golang | `go/` | Build from source |
| Lua | `lua/` | Build from source |
| PHP | `php/` | Build from source |
| Python | `py/` | Build from source |
| Ruby | `rb/` | Build from source |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### Go CLI

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### Go MCP server

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `real-or-fake-village_list`: List records for an entity. Supported entities: `county`, `search`.
- `real-or-fake-village_load`: Load one record for an entity. Supported entities: `fake`, `quiz`, `random`, `sate`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `ratelimit`: Client-side rate limiting via a token bucket
- `retry`: Automatic retry of transient failures with exponential backoff
- `test`: In-memory mock transport for testing without a live server
- `timeout`: Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

