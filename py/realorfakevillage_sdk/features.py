# RealOrFakeVillage SDK feature factory

from realorfakevillage_sdk.feature.base_feature import RealOrFakeVillageBaseFeature
from realorfakevillage_sdk.feature.ratelimit_feature import RealOrFakeVillageRatelimitFeature
from realorfakevillage_sdk.feature.retry_feature import RealOrFakeVillageRetryFeature
from realorfakevillage_sdk.feature.test_feature import RealOrFakeVillageTestFeature
from realorfakevillage_sdk.feature.timeout_feature import RealOrFakeVillageTimeoutFeature


_FEATURES = {
    "base": lambda: RealOrFakeVillageBaseFeature(),
    "ratelimit": lambda: RealOrFakeVillageRatelimitFeature(),
    "retry": lambda: RealOrFakeVillageRetryFeature(),
    "test": lambda: RealOrFakeVillageTestFeature(),
    "timeout": lambda: RealOrFakeVillageTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
