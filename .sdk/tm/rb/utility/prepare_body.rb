# RealOrFakeVillage SDK utility: prepare_body
require_relative 'media'
module RealOrFakeVillageUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return RealOrFakeVillageUtilities.raw_body(ctx.reqdata) if RealOrFakeVillageUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
