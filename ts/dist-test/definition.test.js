"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "county",
        "accessor": "County",
        "op": "list",
        "method": "GET",
        "path": "/sate/counties",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": null,
        "status": 200,
        "sample": {
            "data": [
                {
                    "name": "Alba",
                    "code": "AB",
                    "villages": 716,
                    "communes": 78,
                    "random": "https://api.tasta.space/v1/sate/random?judet=AB"
                }
            ],
            "meta": {
                "total": 42
            }
        },
        "idField": "id"
    },
    {
        "entity": "fake",
        "accessor": "Fake",
        "op": "load",
        "method": "GET",
        "path": "/sate/fake",
        "args": [],
        "select": {
            "seed": "mamaliga"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "seed"
        ],
        "queryArgs": [
            {
                "name": "seed",
                "wire": "seed"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "name": "Solați",
                "exists": false,
                "seed": "mamaliga",
                "permalink": "https://api.tasta.space/v1/sate/fake?seed=mamaliga",
                "sign": "https://api.tasta.space/v1/sate/sign?name=Sola%C8%9Bi"
            },
            "meta": {
                "learned_from": "10236 real names"
            }
        },
        "idField": "id"
    },
    {
        "entity": "quiz",
        "accessor": "Quiz",
        "op": "load",
        "method": "GET",
        "path": "/sate/quiz/{token}",
        "args": [
            {
                "name": "id",
                "wire": "token",
                "value": "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw"
            }
        ],
        "select": {
            "guess": "a"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "guess"
        ],
        "queryArgs": [
            {
                "name": "guess",
                "wire": "guess"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "correct": true,
                "guess": "a",
                "answer": "a",
                "quip": "Correct. Corbu is real, in comuna Lipovăț, județul Vaslui. Sinteni-Sloborel exists only in our heads.",
                "real": {
                    "name": "Covrigi",
                    "type": "sat",
                    "is_seat": false,
                    "commune": {
                        "name": "Văgiulești",
                        "type": "comună",
                        "siruta": 82779
                    },
                    "county": {
                        "name": "Gorj",
                        "code": "GJ"
                    },
                    "siruta": 82804,
                    "coordinates": {
                        "lat": 44.7382,
                        "lon": 23.1492
                    },
                    "map": "https://www.openstreetmap.org/?mlat=44.7382&mlon=23.1492#map=14/44.7382/23.1492",
                    "sign": "https://api.tasta.space/v1/sate/sign?name=Covrigi",
                    "exists": true,
                    "where": "comuna Lipovăț, județul Vaslui"
                },
                "fake": {
                    "name": "Sinteni-Sloborel",
                    "exists": false,
                    "sign": "https://api.tasta.space/v1/sate/sign?name=Sinteni-Sloborel&exit=1"
                },
                "play_again": "https://api.tasta.space/v1/sate/quiz"
            }
        },
        "idField": "id"
    },
    {
        "entity": "quiz",
        "accessor": "Quiz",
        "op": "load",
        "method": "GET",
        "path": "/sate/quiz",
        "args": [],
        "select": {
            "seed": "mamaliga"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "seed"
        ],
        "queryArgs": [
            {
                "name": "seed",
                "wire": "seed"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "question": "One of these is a real place in Romania. We made the other one up. Which one is real?",
                "a": "Corbu",
                "b": "Sinteni-Sloborel",
                "token": "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw",
                "answer": {
                    "a": "https://api.tasta.space/v1/sate/quiz/eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw?guess=a",
                    "b": "https://api.tasta.space/v1/sate/quiz/eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw?guess=b"
                },
                "seed": "mamaliga",
                "permalink": "https://api.tasta.space/v1/sate/quiz?seed=mamaliga"
            }
        },
        "idField": "id"
    },
    {
        "entity": "random",
        "accessor": "Random",
        "op": "load",
        "method": "GET",
        "path": "/sate/random",
        "args": [],
        "select": {
            "judet": "MM"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "judet"
        ],
        "queryArgs": [
            {
                "name": "judet",
                "wire": "judet"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "name": "Covrigi",
                "type": "sat",
                "is_seat": false,
                "commune": {
                    "name": "Văgiulești",
                    "type": "comună",
                    "siruta": 82779
                },
                "county": {
                    "name": "Gorj",
                    "code": "GJ"
                },
                "siruta": 82804,
                "coordinates": {
                    "lat": 44.7382,
                    "lon": 23.1492
                },
                "map": "https://www.openstreetmap.org/?mlat=44.7382&mlon=23.1492#map=14/44.7382/23.1492",
                "sign": "https://api.tasta.space/v1/sate/sign?name=Covrigi",
                "exists": true,
                "where": "comuna Lipovăț, județul Vaslui"
            }
        },
        "idField": "id"
    },
    {
        "entity": "sate",
        "accessor": "Sate",
        "op": "load",
        "method": "GET",
        "path": "/sate",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "villages": 13750,
                "communes": 3181,
                "counties": 42,
                "fake_names_learned_from": 10236,
                "source": "SIRUTA, Institutul Național de Statistică (SIRUTA S1 2026), CC BY 4.0. Coordinates: Wikidata, CC0.",
                "endpoints": {}
            }
        },
        "idField": "id"
    },
    {
        "entity": "search",
        "accessor": "Search",
        "op": "list",
        "method": "GET",
        "path": "/sate/search",
        "args": [],
        "select": {
            "q": "fundu",
            "judet": "MM",
            "page": 1,
            "per_page": 5
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "q",
            "judet",
            "page",
            "per_page"
        ],
        "queryArgs": [
            {
                "name": "judet",
                "wire": "judet"
            },
            {
                "name": "page",
                "wire": "page"
            },
            {
                "name": "per_page",
                "wire": "per_page"
            },
            {
                "name": "q",
                "wire": "q"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": [
                {
                    "name": "Covrigi",
                    "type": "sat",
                    "is_seat": false,
                    "commune": {
                        "name": "Văgiulești",
                        "type": "comună",
                        "siruta": 82779
                    },
                    "county": {
                        "name": "Gorj",
                        "code": "GJ"
                    },
                    "siruta": 82804,
                    "coordinates": {
                        "lat": 44.7382,
                        "lon": 23.1492
                    },
                    "map": "https://www.openstreetmap.org/?mlat=44.7382&mlon=23.1492#map=14/44.7382/23.1492",
                    "sign": "https://api.tasta.space/v1/sate/sign?name=Covrigi",
                    "exists": true,
                    "where": "comuna Lipovăț, județul Vaslui"
                }
            ],
            "meta": {
                "page": 1,
                "per_page": 5,
                "total": 8,
                "last_page": 2,
                "filters": {
                    "q": "fundu",
                    "judet": "MM"
                }
            },
            "links": {
                "next": "x",
                "prev": "x"
            }
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map