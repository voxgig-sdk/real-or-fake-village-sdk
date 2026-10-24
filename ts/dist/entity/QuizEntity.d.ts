import { RealOrFakeVillageEntityBase } from '../RealOrFakeVillageEntityBase';
import type { RealOrFakeVillageSDK } from '../RealOrFakeVillageSDK';
import type { Control } from '../types';
import type { Quiz, QuizLoadMatch } from '../RealOrFakeVillageTypes';
declare class QuizEntity extends RealOrFakeVillageEntityBase<Quiz> {
    constructor(client: RealOrFakeVillageSDK, entopts: any);
    make(this: QuizEntity): QuizEntity;
    load(this: any, reqmatch?: QuizLoadMatch, ctrl?: Control): Promise<QuizEntity>;
}
export { QuizEntity };
