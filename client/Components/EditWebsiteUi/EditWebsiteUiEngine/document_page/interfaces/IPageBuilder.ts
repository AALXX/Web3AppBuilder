import { IPage } from './IPage';

export interface IPageBuilder {
    readonly type: string;

    buildFromJson(json: any): IPage;
}
