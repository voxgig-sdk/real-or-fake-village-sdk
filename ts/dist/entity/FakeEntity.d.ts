import { RealOrFakeVillageEntityBase } from '../RealOrFakeVillageEntityBase';
import type { RealOrFakeVillageSDK } from '../RealOrFakeVillageSDK';
import type { Control } from '../types';
import type { Fake, FakeLoadMatch } from '../RealOrFakeVillageTypes';
declare class FakeEntity extends RealOrFakeVillageEntityBase<Fake> {
    constructor(client: RealOrFakeVillageSDK, entopts: any);
    make(this: FakeEntity): FakeEntity;
    load(this: any, reqmatch?: FakeLoadMatch, ctrl?: Control): Promise<FakeEntity>;
}
export { FakeEntity };
