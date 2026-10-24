# RealOrFakeVillage SDK utility: make_context

from realorfakevillage_sdk.core.context import RealOrFakeVillageContext


def make_context_util(ctxmap, basectx):
    return RealOrFakeVillageContext(ctxmap, basectx)
