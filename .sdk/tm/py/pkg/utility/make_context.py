# RealOrFakeVillage SDK utility: make_context

from projectname_sdk.core.context import RealOrFakeVillageContext


def make_context_util(ctxmap, basectx):
    return RealOrFakeVillageContext(ctxmap, basectx)
