-- Typed models for the RealOrFakeVillage SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
-- params (op.<name>.points[].g.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class County
---@field code string
---@field communes number
---@field name string
---@field random string
---@field villages number

---@class CountyListMatch
---@field code? string
---@field communes? number
---@field name? string
---@field random? string
---@field villages? number

---@class Fake
---@field data table
---@field meta table

---@class FakeLoadMatch
---@field seed? string

---@class Quiz
---@field a string
---@field answer string
---@field b string
---@field correct boolean
---@field fake table
---@field guess string
---@field id? string
---@field permalink string
---@field play_again string
---@field question string
---@field quip string
---@field real table
---@field seed string
---@field token string

---@class QuizLoadMatch
---@field id string
---@field guess string

---@class Random
---@field commune table
---@field coordinates table
---@field county table
---@field exists boolean
---@field is_seat boolean
---@field map string
---@field name string
---@field sign string
---@field siruta number
---@field type string
---@field where? string

---@class RandomLoadMatch
---@field judet? string

---@class Sate
---@field communes number
---@field counties number
---@field endpoints table
---@field fake_names_learned_from number
---@field source string
---@field villages number

---@class SateLoadMatch
---@field communes? number
---@field counties? number
---@field endpoints? table
---@field fake_names_learned_from? number
---@field source? string
---@field villages? number

---@class Search
---@field commune table
---@field coordinates table
---@field county table
---@field exists boolean
---@field is_seat boolean
---@field map string
---@field name string
---@field sign string
---@field siruta number
---@field type string
---@field where? string

---@class SearchListMatch
---@field judet? string
---@field page? number
---@field per_page? number
---@field q string

local M = {}

return M
