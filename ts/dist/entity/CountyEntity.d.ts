import { RealOrFakeVillageEntityBase } from '../RealOrFakeVillageEntityBase';
import type { RealOrFakeVillageSDK } from '../RealOrFakeVillageSDK';
import type { Control } from '../types';
import type { County, CountyListMatch } from '../RealOrFakeVillageTypes';
declare class CountyEntity extends RealOrFakeVillageEntityBase<County> {
    constructor(client: RealOrFakeVillageSDK, entopts: any);
    make(this: CountyEntity): CountyEntity;
    list(this: any, reqmatch?: CountyListMatch, ctrl?: Control): Promise<CountyEntity[]>;
}
export { CountyEntity };
