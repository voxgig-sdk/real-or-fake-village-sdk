# RealOrFakeVillage SDK exists test

import pytest
from realorfakevillage_sdk import RealOrFakeVillageSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = RealOrFakeVillageSDK.test(None, None)
        assert testsdk is not None
