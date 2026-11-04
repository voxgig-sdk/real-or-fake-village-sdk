# frozen_string_literal: true

# Typed models for the RealOrFakeVillage SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# County entity data model.
#
# @!attribute [rw] code
#   @return [String]
#
# @!attribute [rw] communes
#   @return [Integer]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] random
#   @return [String]
#
# @!attribute [rw] villages
#   @return [Integer]
County = Struct.new(
  :code,
  :communes,
  :name,
  :random,
  :villages,
  keyword_init: true
)

# Request payload for County#list.
#
# @!attribute [rw] code
#   @return [String, nil]
#
# @!attribute [rw] communes
#   @return [Integer, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
#
# @!attribute [rw] random
#   @return [String, nil]
#
# @!attribute [rw] villages
#   @return [Integer, nil]
CountyListMatch = Struct.new(
  :code,
  :communes,
  :name,
  :random,
  :villages,
  keyword_init: true
)

# Fake entity data model.
#
# @!attribute [rw] exists
#   @return [Boolean]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] permalink
#   @return [String]
#
# @!attribute [rw] seed
#   @return [String]
#
# @!attribute [rw] sign
#   @return [String]
Fake = Struct.new(
  :exists,
  :name,
  :permalink,
  :seed,
  :sign,
  keyword_init: true
)

# Request payload for Fake#load.
#
# @!attribute [rw] seed
#   @return [String, nil]
FakeLoadMatch = Struct.new(
  :seed,
  keyword_init: true
)

# Quiz entity data model.
#
# @!attribute [rw] a
#   @return [String]
#
# @!attribute [rw] answer
#   @return [String]
#
# @!attribute [rw] b
#   @return [String]
#
# @!attribute [rw] correct
#   @return [Boolean]
#
# @!attribute [rw] fake
#   @return [Hash]
#
# @!attribute [rw] guess
#   @return [String]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] permalink
#   @return [String]
#
# @!attribute [rw] play_again
#   @return [String]
#
# @!attribute [rw] question
#   @return [String]
#
# @!attribute [rw] quip
#   @return [String]
#
# @!attribute [rw] real
#   @return [Hash]
#
# @!attribute [rw] seed
#   @return [String]
#
# @!attribute [rw] token
#   @return [String]
Quiz = Struct.new(
  :a,
  :answer,
  :b,
  :correct,
  :fake,
  :guess,
  :id,
  :permalink,
  :play_again,
  :question,
  :quip,
  :real,
  :seed,
  :token,
  keyword_init: true
)

# Request payload for Quiz#load.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] guess
#   @return [String]
QuizLoadMatch = Struct.new(
  :id,
  :guess,
  keyword_init: true
)

# Random entity data model.
#
# @!attribute [rw] commune
#   @return [Hash]
#
# @!attribute [rw] coordinates
#   @return [Hash]
#
# @!attribute [rw] county
#   @return [Hash]
#
# @!attribute [rw] exists
#   @return [Boolean]
#
# @!attribute [rw] is_seat
#   @return [Boolean]
#
# @!attribute [rw] map
#   @return [String]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] sign
#   @return [String]
#
# @!attribute [rw] siruta
#   @return [Integer]
#
# @!attribute [rw] type
#   @return [String]
#
# @!attribute [rw] where
#   @return [String, nil]
RandomType = Struct.new(
  :commune,
  :coordinates,
  :county,
  :exists,
  :is_seat,
  :map,
  :name,
  :sign,
  :siruta,
  :type,
  :where,
  keyword_init: true
)

# Request payload for Random#load.
#
# @!attribute [rw] judet
#   @return [String, nil]
RandomLoadMatch = Struct.new(
  :judet,
  keyword_init: true
)

# Sate entity data model.
#
# @!attribute [rw] communes
#   @return [Integer]
#
# @!attribute [rw] counties
#   @return [Integer]
#
# @!attribute [rw] endpoints
#   @return [Hash]
#
# @!attribute [rw] fake_names_learned_from
#   @return [Integer]
#
# @!attribute [rw] source
#   @return [String]
#
# @!attribute [rw] villages
#   @return [Integer]
Sate = Struct.new(
  :communes,
  :counties,
  :endpoints,
  :fake_names_learned_from,
  :source,
  :villages,
  keyword_init: true
)

# Request payload for Sate#load.
#
# @!attribute [rw] communes
#   @return [Integer, nil]
#
# @!attribute [rw] counties
#   @return [Integer, nil]
#
# @!attribute [rw] endpoints
#   @return [Hash, nil]
#
# @!attribute [rw] fake_names_learned_from
#   @return [Integer, nil]
#
# @!attribute [rw] source
#   @return [String, nil]
#
# @!attribute [rw] villages
#   @return [Integer, nil]
SateLoadMatch = Struct.new(
  :communes,
  :counties,
  :endpoints,
  :fake_names_learned_from,
  :source,
  :villages,
  keyword_init: true
)

# Search entity data model.
#
# @!attribute [rw] commune
#   @return [Hash]
#
# @!attribute [rw] coordinates
#   @return [Hash]
#
# @!attribute [rw] county
#   @return [Hash]
#
# @!attribute [rw] exists
#   @return [Boolean]
#
# @!attribute [rw] is_seat
#   @return [Boolean]
#
# @!attribute [rw] map
#   @return [String]
#
# @!attribute [rw] name
#   @return [String]
#
# @!attribute [rw] sign
#   @return [String]
#
# @!attribute [rw] siruta
#   @return [Integer]
#
# @!attribute [rw] type
#   @return [String]
#
# @!attribute [rw] where
#   @return [String, nil]
Search = Struct.new(
  :commune,
  :coordinates,
  :county,
  :exists,
  :is_seat,
  :map,
  :name,
  :sign,
  :siruta,
  :type,
  :where,
  keyword_init: true
)

# Request payload for Search#list.
#
# @!attribute [rw] judet
#   @return [String, nil]
#
# @!attribute [rw] page
#   @return [Integer, nil]
#
# @!attribute [rw] per_page
#   @return [Integer, nil]
#
# @!attribute [rw] q
#   @return [String]
SearchListMatch = Struct.new(
  :judet,
  :page,
  :per_page,
  :q,
  keyword_init: true
)

