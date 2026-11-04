-- RealOrFakeVillage SDK configuration

-- Build a fresh, fully materialised config table. Every call rebuilds the
-- whole structure, so prefer require("config_shared") unless you need a
-- private copy you intend to mutate.
local function make_config()
  return {
    main = {
      name = "RealOrFakeVillage",
      slug = "real-or-fake-village",
      version = "0.0.1",
      target = "lua",
    },
    feature = {
      ["ratelimit"] = {
        ["options"] = {
          ["active"] = false,
          ["burst"] = 5,
          ["rate"] = 5,
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
          ["sleep"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
      ["retry"] = {
        ["options"] = {
          ["active"] = false,
          ["factor"] = 2,
          ["maxDelay"] = 2000,
          ["minDelay"] = 50,
          ["retries"] = 2,
          ["statuses"] = {
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          },
        },
        ["optspec"] = {
          ["jitter"] = "`$BOOLEAN`",
          ["sleep"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
      ["test"] = {
        ["options"] = {
          ["active"] = false,
        },
        ["optspec"] = {
          ["entity"] = "`$MAP`",
          ["net"] = "`$MAP`",
        },
        ["strict"] = false,
        ["transport"] = "base",
      },
      ["timeout"] = {
        ["options"] = {
          ["active"] = false,
          ["ms"] = 30000,
        },
        ["optspec"] = {
          ["clearTimer"] = "`$FUNCTION`",
          ["now"] = "`$FUNCTION`",
          ["setTimer"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
    },
    options = {
      base = "https://api.tasta.space/v1",
      headers = {
        ["content-type"] = "application/json",
      },
      entity = {
        ["county"] = {},
        ["fake"] = {},
        ["quiz"] = {},
        ["random"] = {},
        ["sate"] = {},
        ["search"] = {},
      },
    },
    entity = {
      ["county"] = {
        ["fields"] = {
          {
            ["name"] = "code",
            ["title"] = "Code",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "County code, as judet takes it.",
          },
          {
            ["name"] = "communes",
            ["title"] = "Communes",
            ["type"] = "`$INTEGER`",
            ["req"] = true,
            ["short"] = "Communes, towns and cities in this county.",
          },
          {
            ["name"] = "name",
            ["title"] = "Name",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "County name.",
          },
          {
            ["name"] = "random",
            ["title"] = "Random",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Link to a random place in this county.",
          },
          {
            ["name"] = "villages",
            ["title"] = "Villages",
            ["type"] = "`$INTEGER`",
            ["req"] = true,
            ["short"] = "Places in the register in this county.",
          },
        },
        ["name"] = "county",
        ["op"] = {
          ["list"] = {
            ["input"] = "data",
            ["name"] = "list",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/sate/counties",
                ["segments"] = {
                  {
                    ["lit"] = "sate",
                  },
                  {
                    ["lit"] = "counties",
                  },
                },
                ["parts"] = {
                  "sate",
                  "counties",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.data`",
                },
                ["args"] = {},
                ["select"] = {},
                ["response"] = {
                  ["kind"] = "json",
                  ["media"] = "application/json",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["fake"] = {
        ["fields"] = {
          {
            ["name"] = "exists",
            ["title"] = "Exists",
            ["type"] = "`$BOOLEAN`",
            ["req"] = true,
            ["short"] = "Always false.",
          },
          {
            ["name"] = "name",
            ["title"] = "Name",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "A made-up village name that is nowhere in the register.",
          },
          {
            ["name"] = "permalink",
            ["title"] = "Permalink",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Link that reproduces this name.",
          },
          {
            ["name"] = "seed",
            ["title"] = "Seed",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "The seed; the same seed always gives the same name.",
          },
          {
            ["name"] = "sign",
            ["title"] = "Sign",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Link to its entry sign (SVG image).",
          },
        },
        ["name"] = "fake",
        ["op"] = {
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/sate/fake",
                ["segments"] = {
                  {
                    ["lit"] = "sate",
                  },
                  {
                    ["lit"] = "fake",
                  },
                },
                ["parts"] = {
                  "sate",
                  "fake",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.data`",
                },
                ["args"] = {
                  ["query"] = {
                    {
                      ["name"] = "seed",
                      ["orig"] = "seed",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                      ["example"] = "mamaliga",
                      ["field"] = true,
                    },
                  },
                },
                ["select"] = {},
                ["response"] = {
                  ["kind"] = "json",
                  ["media"] = "application/json",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["quiz"] = {
        ["fields"] = {
          {
            ["name"] = "a",
            ["title"] = "A",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Name in slot a.",
          },
          {
            ["name"] = "answer",
            ["title"] = "Answer",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "The slot holding the real place.",
          },
          {
            ["name"] = "b",
            ["title"] = "B",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Name in slot b.",
          },
          {
            ["name"] = "correct",
            ["title"] = "Correct",
            ["type"] = "`$BOOLEAN`",
            ["req"] = true,
            ["short"] = "Whether the guess was right.",
          },
          {
            ["name"] = "fake",
            ["title"] = "Fake",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "The made-up name.",
          },
          {
            ["name"] = "guess",
            ["title"] = "Guess",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "The guess.",
          },
          {
            ["name"] = "id",
            ["title"] = "Id",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "permalink",
            ["title"] = "Permalink",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Link that reproduces this quiz.",
          },
          {
            ["name"] = "play_again",
            ["title"] = "Play Again",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Link to a fresh quiz.",
          },
          {
            ["name"] = "question",
            ["title"] = "Question",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "The question, in English.",
          },
          {
            ["name"] = "quip",
            ["title"] = "Quip",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "A remark, in English.",
          },
          {
            ["name"] = "real",
            ["title"] = "Real",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "A real place from SIRUTA, the Romanian register of localities.",
          },
          {
            ["name"] = "seed",
            ["title"] = "Seed",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "The seed; the same seed always gives the same quiz.",
          },
          {
            ["name"] = "token",
            ["title"] = "Token",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "The quiz itself, signed (base64url payload plus HMAC).",
          },
        },
        ["id"] = {
          ["field"] = "id",
          ["name"] = "id",
        },
        ["name"] = "quiz",
        ["op"] = {
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/sate/quiz/{token}",
                ["segments"] = {
                  {
                    ["lit"] = "sate",
                  },
                  {
                    ["lit"] = "quiz",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "sate",
                  "quiz",
                  "{id}",
                },
                ["rename"] = {
                  ["param"] = {
                    ["token"] = "id",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.data`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "token",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                      ["example"] = "eyJ2IjoxLCJyIjoxNjQ3MjEsImYiOiJTaW50ZW5pLVNsb2JvcmVsIiwicyI6ImEifQ.IHzAvNHKqc-eLx39mvzSvw",
                    },
                  },
                  ["query"] = {
                    {
                      ["name"] = "guess",
                      ["orig"] = "guess",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                      ["reqd"] = true,
                      ["example"] = "a",
                      ["field"] = true,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "guess",
                    "id",
                  },
                },
                ["response"] = {
                  ["kind"] = "json",
                  ["media"] = "application/json",
                },
              },
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/sate/quiz",
                ["segments"] = {
                  {
                    ["lit"] = "sate",
                  },
                  {
                    ["lit"] = "quiz",
                  },
                },
                ["parts"] = {
                  "sate",
                  "quiz",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.data`",
                },
                ["args"] = {
                  ["query"] = {
                    {
                      ["name"] = "seed",
                      ["orig"] = "seed",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                      ["example"] = "mamaliga",
                      ["field"] = true,
                    },
                  },
                },
                ["select"] = {},
                ["response"] = {
                  ["kind"] = "json",
                  ["media"] = "application/json",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["random"] = {
        ["fields"] = {
          {
            ["name"] = "commune",
            ["title"] = "Commune",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "The administrative unit the place belongs to.",
          },
          {
            ["name"] = "coordinates",
            ["title"] = "Coordinates",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "Where it is, from Wikidata; documented as null for the few places Wikidata has no point for.",
          },
          {
            ["name"] = "county",
            ["title"] = "County",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "The county.",
          },
          {
            ["name"] = "exists",
            ["title"] = "Exists",
            ["type"] = "`$BOOLEAN`",
            ["req"] = true,
            ["short"] = "Always true for a real place.",
          },
          {
            ["name"] = "is_seat",
            ["title"] = "Is Seat",
            ["type"] = "`$BOOLEAN`",
            ["req"] = true,
            ["short"] = "True for the village that is the seat of its commune, and for the main place of a town or city.",
          },
          {
            ["name"] = "map",
            ["title"] = "Map",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "OpenStreetMap link to the coordinates; documented as null when there are none.",
          },
          {
            ["name"] = "name",
            ["title"] = "Name",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Place name, in proper case with comma-below ș and ț.",
          },
          {
            ["name"] = "sign",
            ["title"] = "Sign",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Link to the place's entry sign (SVG image, not JSON).",
          },
          {
            ["name"] = "siruta",
            ["title"] = "Siruta",
            ["type"] = "`$INTEGER`",
            ["req"] = true,
            ["short"] = "The place's code in SIRUTA, the national register; tells apart places that share a name.",
          },
          {
            ["name"] = "type",
            ["title"] = "Type",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own).",
          },
          {
            ["name"] = "where",
            ["title"] = "Where",
            ["type"] = "`$STRING`",
            ["short"] = "The commune and county in words.",
          },
        },
        ["name"] = "random",
        ["op"] = {
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/sate/random",
                ["segments"] = {
                  {
                    ["lit"] = "sate",
                  },
                  {
                    ["lit"] = "random",
                  },
                },
                ["parts"] = {
                  "sate",
                  "random",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.data`",
                },
                ["args"] = {
                  ["query"] = {
                    {
                      ["name"] = "judet",
                      ["orig"] = "judet",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                      ["example"] = "MM",
                    },
                  },
                },
                ["select"] = {},
                ["response"] = {
                  ["kind"] = "json",
                  ["media"] = "application/json",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["sate"] = {
        ["fields"] = {
          {
            ["name"] = "communes",
            ["title"] = "Communes",
            ["type"] = "`$INTEGER`",
            ["req"] = true,
            ["short"] = "Communes, towns and cities.",
          },
          {
            ["name"] = "counties",
            ["title"] = "Counties",
            ["type"] = "`$INTEGER`",
            ["req"] = true,
            ["short"] = "Counties, București included.",
          },
          {
            ["name"] = "endpoints",
            ["title"] = "Endpoints",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "Example links to each endpoint, keyed by name (random, fake, quiz, search, counties, sign).",
          },
          {
            ["name"] = "fake_names_learned_from",
            ["title"] = "Fake Names Learned From",
            ["type"] = "`$INTEGER`",
            ["req"] = true,
            ["short"] = "Distinct real names the fake-name machine learned from.",
          },
          {
            ["name"] = "source",
            ["title"] = "Source",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Data sources and licences.",
          },
          {
            ["name"] = "villages",
            ["title"] = "Villages",
            ["type"] = "`$INTEGER`",
            ["req"] = true,
            ["short"] = "Real places in the register.",
          },
        },
        ["name"] = "sate",
        ["op"] = {
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/sate",
                ["segments"] = {
                  {
                    ["lit"] = "sate",
                  },
                },
                ["parts"] = {
                  "sate",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.data`",
                },
                ["args"] = {},
                ["select"] = {},
                ["response"] = {
                  ["kind"] = "json",
                  ["media"] = "application/json",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["search"] = {
        ["fields"] = {
          {
            ["name"] = "commune",
            ["title"] = "Commune",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "The administrative unit the place belongs to.",
          },
          {
            ["name"] = "coordinates",
            ["title"] = "Coordinates",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "Where it is, from Wikidata; documented as null for the few places Wikidata has no point for.",
          },
          {
            ["name"] = "county",
            ["title"] = "County",
            ["type"] = "`$OBJECT`",
            ["req"] = true,
            ["short"] = "The county.",
          },
          {
            ["name"] = "exists",
            ["title"] = "Exists",
            ["type"] = "`$BOOLEAN`",
            ["req"] = true,
            ["short"] = "Always true for a real place.",
          },
          {
            ["name"] = "is_seat",
            ["title"] = "Is Seat",
            ["type"] = "`$BOOLEAN`",
            ["req"] = true,
            ["short"] = "True for the village that is the seat of its commune, and for the main place of a town or city.",
          },
          {
            ["name"] = "map",
            ["title"] = "Map",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "OpenStreetMap link to the coordinates; documented as null when there are none.",
          },
          {
            ["name"] = "name",
            ["title"] = "Name",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Place name, in proper case with comma-below ș and ț.",
          },
          {
            ["name"] = "sign",
            ["title"] = "Sign",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Link to the place's entry sign (SVG image, not JSON).",
          },
          {
            ["name"] = "siruta",
            ["title"] = "Siruta",
            ["type"] = "`$INTEGER`",
            ["req"] = true,
            ["short"] = "The place's code in SIRUTA, the national register; tells apart places that share a name.",
          },
          {
            ["name"] = "type",
            ["title"] = "Type",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "sat (village), oraș (town), municipiu (city) or localitate componentă (a part of a town or city listed as a place of its own).",
          },
          {
            ["name"] = "where",
            ["title"] = "Where",
            ["type"] = "`$STRING`",
            ["short"] = "The commune and county in words.",
          },
        },
        ["name"] = "search",
        ["op"] = {
          ["list"] = {
            ["input"] = "data",
            ["name"] = "list",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/sate/search",
                ["segments"] = {
                  {
                    ["lit"] = "sate",
                  },
                  {
                    ["lit"] = "search",
                  },
                },
                ["parts"] = {
                  "sate",
                  "search",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.data`",
                },
                ["args"] = {
                  ["query"] = {
                    {
                      ["name"] = "judet",
                      ["orig"] = "judet",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                      ["example"] = "MM",
                    },
                    {
                      ["name"] = "page",
                      ["orig"] = "page",
                      ["type"] = "`$INTEGER`",
                      ["kind"] = "query",
                      ["example"] = 1,
                    },
                    {
                      ["name"] = "per_page",
                      ["orig"] = "per_page",
                      ["type"] = "`$INTEGER`",
                      ["kind"] = "query",
                      ["example"] = 5,
                    },
                    {
                      ["name"] = "q",
                      ["orig"] = "q",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                      ["reqd"] = true,
                      ["example"] = "fundu",
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "q",
                  },
                },
                ["response"] = {
                  ["kind"] = "json",
                  ["media"] = "application/json",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
    },
  }
end


local function make_feature(name)
  local features = require("features")
  local factory = features[name]
  if factory ~= nil then
    return factory()
  end
  return features.base()
end


-- Attach make_feature to the SDK class
local function setup_sdk(SDK)
  SDK._make_feature = make_feature
end


return make_config
