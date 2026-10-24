-- RealOrFakeVillage SDK exists test

local sdk = require("real-or-fake-village_sdk")

describe("RealOrFakeVillageSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
