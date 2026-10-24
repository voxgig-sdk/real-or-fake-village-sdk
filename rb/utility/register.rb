# RealOrFakeVillage SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

RealOrFakeVillageUtility.registrar = ->(u) {
  u.clean = RealOrFakeVillageUtilities::Clean
  u.clean_add = RealOrFakeVillageUtilities::CleanAdd
  u.clean_explain = RealOrFakeVillageUtilities::CleanExplain
  u.done = RealOrFakeVillageUtilities::Done
  u.make_error = RealOrFakeVillageUtilities::MakeError
  u.feature_add = RealOrFakeVillageUtilities::FeatureAdd
  u.feature_hook = RealOrFakeVillageUtilities::FeatureHook
  u.feature_init = RealOrFakeVillageUtilities::FeatureInit
  u.fetcher = RealOrFakeVillageUtilities::Fetcher
  u.make_fetch_def = RealOrFakeVillageUtilities::MakeFetchDef
  u.make_context = RealOrFakeVillageUtilities::MakeContext
  u.make_options = RealOrFakeVillageUtilities::MakeOptions
  u.make_request = RealOrFakeVillageUtilities::MakeRequest
  u.make_response = RealOrFakeVillageUtilities::MakeResponse
  u.make_result = RealOrFakeVillageUtilities::MakeResult
  u.make_point = RealOrFakeVillageUtilities::MakePoint
  u.make_spec = RealOrFakeVillageUtilities::MakeSpec
  u.make_url = RealOrFakeVillageUtilities::MakeUrl
  u.param = RealOrFakeVillageUtilities::Param
  u.prepare_auth = RealOrFakeVillageUtilities::PrepareAuth
  u.prepare_body = RealOrFakeVillageUtilities::PrepareBody
  u.prepare_headers = RealOrFakeVillageUtilities::PrepareHeaders
  u.prepare_method = RealOrFakeVillageUtilities::PrepareMethod
  u.prepare_params = RealOrFakeVillageUtilities::PrepareParams
  u.prepare_path = RealOrFakeVillageUtilities::PreparePath
  u.prepare_query = RealOrFakeVillageUtilities::PrepareQuery
  u.graphql_body = RealOrFakeVillageUtilities::GraphqlBody
  u.graphql_errors = RealOrFakeVillageUtilities::GraphqlErrors
  u.result_basic = RealOrFakeVillageUtilities::ResultBasic
  u.result_body = RealOrFakeVillageUtilities::ResultBody
  u.result_headers = RealOrFakeVillageUtilities::ResultHeaders
  u.transform_request = RealOrFakeVillageUtilities::TransformRequest
  u.transform_response = RealOrFakeVillageUtilities::TransformResponse
}
