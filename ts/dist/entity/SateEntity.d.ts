import { RealOrFakeVillageEntityBase } from '../RealOrFakeVillageEntityBase';
import type { RealOrFakeVillageSDK } from '../RealOrFakeVillageSDK';
import type { Control } from '../types';
import type { Sate, SateLoadMatch } from '../RealOrFakeVillageTypes';
declare class SateEntity extends RealOrFakeVillageEntityBase<Sate> {
    constructor(client: RealOrFakeVillageSDK, entopts: any);
    make(this: SateEntity): SateEntity;
    load(this: any, reqmatch?: SateLoadMatch, ctrl?: Control): Promise<SateEntity>;
}
export { SateEntity };
