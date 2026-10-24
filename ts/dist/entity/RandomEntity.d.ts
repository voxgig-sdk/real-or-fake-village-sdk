import { RealOrFakeVillageEntityBase } from '../RealOrFakeVillageEntityBase';
import type { RealOrFakeVillageSDK } from '../RealOrFakeVillageSDK';
import type { Control } from '../types';
import type { Random, RandomLoadMatch } from '../RealOrFakeVillageTypes';
declare class RandomEntity extends RealOrFakeVillageEntityBase<Random> {
    constructor(client: RealOrFakeVillageSDK, entopts: any);
    make(this: RandomEntity): RandomEntity;
    load(this: any, reqmatch?: RandomLoadMatch, ctrl?: Control): Promise<RandomEntity>;
}
export { RandomEntity };
