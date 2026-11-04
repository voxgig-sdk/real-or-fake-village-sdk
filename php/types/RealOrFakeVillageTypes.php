<?php
declare(strict_types=1);

// Typed models for the RealOrFakeVillage SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** County entity data model. */
class County
{
    public string $code;
    public int $communes;
    public string $name;
    public string $random;
    public int $villages;
}

/** Request payload for County#list. */
class CountyListMatch
{
    public ?string $code = null;
    public ?int $communes = null;
    public ?string $name = null;
    public ?string $random = null;
    public ?int $villages = null;
}

/** Fake entity data model. */
class Fake
{
    public bool $exists;
    public string $name;
    public string $permalink;
    public string $seed;
    public string $sign;
}

/** Request payload for Fake#load. */
class FakeLoadMatch
{
    public ?string $seed = null;
}

/** Quiz entity data model. */
class Quiz
{
    public string $a;
    public string $answer;
    public string $b;
    public bool $correct;
    public array $fake;
    public string $guess;
    public ?string $id = null;
    public string $permalink;
    public string $play_again;
    public string $question;
    public string $quip;
    public array $real;
    public string $seed;
    public string $token;
}

/** Request payload for Quiz#load. */
class QuizLoadMatch
{
    public string $id;
    public string $guess;
}

/** Random entity data model. */
class Random
{
    public array $commune;
    public array $coordinates;
    public array $county;
    public bool $exists;
    public bool $is_seat;
    public string $map;
    public string $name;
    public string $sign;
    public int $siruta;
    public string $type;
    public ?string $where = null;
}

/** Request payload for Random#load. */
class RandomLoadMatch
{
    public ?string $judet = null;
}

/** Sate entity data model. */
class Sate
{
    public int $communes;
    public int $counties;
    public array $endpoints;
    public int $fake_names_learned_from;
    public string $source;
    public int $villages;
}

/** Request payload for Sate#load. */
class SateLoadMatch
{
    public ?int $communes = null;
    public ?int $counties = null;
    public ?array $endpoints = null;
    public ?int $fake_names_learned_from = null;
    public ?string $source = null;
    public ?int $villages = null;
}

/** Search entity data model. */
class Search
{
    public array $commune;
    public array $coordinates;
    public array $county;
    public bool $exists;
    public bool $is_seat;
    public string $map;
    public string $name;
    public string $sign;
    public int $siruta;
    public string $type;
    public ?string $where = null;
}

/** Request payload for Search#list. */
class SearchListMatch
{
    public ?string $judet = null;
    public ?int $page = null;
    public ?int $per_page = null;
    public string $q;
}

