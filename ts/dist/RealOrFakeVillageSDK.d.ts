import { CountyEntity } from './entity/CountyEntity';
import { FakeEntity } from './entity/FakeEntity';
import { QuizEntity } from './entity/QuizEntity';
import { RandomEntity } from './entity/RandomEntity';
import { SateEntity } from './entity/SateEntity';
import { SearchEntity } from './entity/SearchEntity';
export type * from './RealOrFakeVillageTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { RealOrFakeVillageEntityBase } from './RealOrFakeVillageEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class RealOrFakeVillageSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    County(entopts?: Record<string, any>): CountyEntity;
    Fake(entopts?: Record<string, any>): FakeEntity;
    Quiz(entopts?: Record<string, any>): QuizEntity;
    Random(entopts?: Record<string, any>): RandomEntity;
    Sate(entopts?: Record<string, any>): SateEntity;
    Search(entopts?: Record<string, any>): SearchEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): RealOrFakeVillageSDK;
    tester(testopts?: any, sdkopts?: any): RealOrFakeVillageSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof RealOrFakeVillageSDK;
export { stdutil, config, BaseFeature, RealOrFakeVillageEntityBase, RealOrFakeVillageSDK, SDK, };
export type { DirectResult };
