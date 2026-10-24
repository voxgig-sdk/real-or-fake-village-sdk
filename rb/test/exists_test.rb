# RealOrFakeVillage SDK exists test

require "minitest/autorun"
require_relative "../RealOrFakeVillage_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = RealOrFakeVillageSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
