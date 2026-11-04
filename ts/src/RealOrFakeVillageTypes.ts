// Typed models for the RealOrFakeVillage SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface County {
  code: string
  communes: number
  name: string
  random: string
  villages: number
}

export interface CountyListMatch {
  code?: string
  communes?: number
  name?: string
  random?: string
  villages?: number
}

export interface Fake {
  exists: boolean
  name: string
  permalink: string
  seed: string
  sign: string
}

export interface FakeLoadMatch {
  seed?: string
}

export interface Quiz {
  a: string
  answer: string
  b: string
  correct: boolean
  fake: Record<string, any>
  guess: string
  id?: string
  permalink: string
  play_again: string
  question: string
  quip: string
  real: Record<string, any>
  seed: string
  token: string
}

export interface QuizLoadMatch {
  id: string
  guess: string
}

export interface Random {
  commune: Record<string, any>
  coordinates: Record<string, any>
  county: Record<string, any>
  exists: boolean
  is_seat: boolean
  map: string
  name: string
  sign: string
  siruta: number
  type: string
  where?: string
}

export interface RandomLoadMatch {
  judet?: string
}

export interface Sate {
  communes: number
  counties: number
  endpoints: Record<string, any>
  fake_names_learned_from: number
  source: string
  villages: number
}

export interface SateLoadMatch {
  communes?: number
  counties?: number
  endpoints?: Record<string, any>
  fake_names_learned_from?: number
  source?: string
  villages?: number
}

export interface Search {
  commune: Record<string, any>
  coordinates: Record<string, any>
  county: Record<string, any>
  exists: boolean
  is_seat: boolean
  map: string
  name: string
  sign: string
  siruta: number
  type: string
  where?: string
}

export interface SearchListMatch {
  judet?: string
  page?: number
  per_page?: number
  q: string
}

