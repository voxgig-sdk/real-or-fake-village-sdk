# RealOrFakeVillage SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module RealOrFakeVillageFeatures
  def self.make_feature(name)
    case name
    when "base"
      RealOrFakeVillageBaseFeature.new
    when "ratelimit"
      RealOrFakeVillageRatelimitFeature.new
    when "retry"
      RealOrFakeVillageRetryFeature.new
    when "test"
      RealOrFakeVillageTestFeature.new
    when "timeout"
      RealOrFakeVillageTimeoutFeature.new
    else
      RealOrFakeVillageBaseFeature.new
    end
  end
end
