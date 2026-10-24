# RealOrFakeVillage SDK utility: make_context
require_relative '../core/context'
module RealOrFakeVillageUtilities
  MakeContext = ->(ctxmap, basectx) {
    RealOrFakeVillageContext.new(ctxmap, basectx)
  }
end
