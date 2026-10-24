# Typed models for the RealOrFakeVillage SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class County(TypedDict):
    code: str
    communes: int
    name: str
    random: str
    villages: int


class CountyListMatch(TypedDict, total=False):
    code: str
    communes: int
    name: str
    random: str
    villages: int


class Fake(TypedDict):
    data: dict
    meta: dict


class FakeLoadMatch(TypedDict, total=False):
    seed: str


class QuizRequired(TypedDict):
    a: str
    answer: str
    b: str
    correct: bool
    fake: dict
    guess: str
    permalink: str
    play_again: str
    question: str
    quip: str
    real: dict
    seed: str
    token: str


class Quiz(QuizRequired, total=False):
    id: str


class QuizLoadMatch(TypedDict):
    id: str
    guess: str


class RandomRequired(TypedDict):
    commune: dict
    coordinates: dict
    county: dict
    exists: bool
    is_seat: bool
    map: str
    name: str
    sign: str
    siruta: int
    type: str


class Random(RandomRequired, total=False):
    where: str


class RandomLoadMatch(TypedDict, total=False):
    judet: str


class Sate(TypedDict):
    communes: int
    counties: int
    endpoints: dict
    fake_names_learned_from: int
    source: str
    villages: int


class SateLoadMatch(TypedDict, total=False):
    communes: int
    counties: int
    endpoints: dict
    fake_names_learned_from: int
    source: str
    villages: int


class SearchRequired(TypedDict):
    commune: dict
    coordinates: dict
    county: dict
    exists: bool
    is_seat: bool
    map: str
    name: str
    sign: str
    siruta: int
    type: str


class Search(SearchRequired, total=False):
    where: str


class SearchListMatchRequired(TypedDict):
    q: str


class SearchListMatch(SearchListMatchRequired, total=False):
    judet: str
    page: int
    per_page: int
