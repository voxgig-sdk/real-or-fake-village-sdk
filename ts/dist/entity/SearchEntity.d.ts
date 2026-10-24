import { RealOrFakeVillageEntityBase } from '../RealOrFakeVillageEntityBase';
import type { RealOrFakeVillageSDK } from '../RealOrFakeVillageSDK';
import type { Control } from '../types';
import type { Search, SearchListMatch } from '../RealOrFakeVillageTypes';
declare class SearchEntity extends RealOrFakeVillageEntityBase<Search> {
    constructor(client: RealOrFakeVillageSDK, entopts: any);
    make(this: SearchEntity): SearchEntity;
    list(this: any, reqmatch?: SearchListMatch, ctrl?: Control): Promise<SearchEntity[]>;
}
export { SearchEntity };
