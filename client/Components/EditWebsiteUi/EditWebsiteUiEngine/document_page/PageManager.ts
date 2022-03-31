import { IPage } from './interfaces/IPage';
import { IPageBuilder } from './interfaces/IPageBuilder';

/**
 *
 */
export class PageManager {
    private static _registeredBuilders: { [type: string]: IPageBuilder } = {};

    /**
     *register component builder
     * @param {IComponentBuilder} builder
     */
    public static registerBuilder(builder: IPageBuilder): void {
        PageManager._registeredBuilders[builder.type] = builder;
    }

    /**
     * extract behavior from json file
     * @param {any} json
     * @return {IPage}
     */
    public static extractPageConfig(json: any): IPage {
        if (json.type !== undefined) {
            if (PageManager._registeredBuilders[String(json.type)] !== undefined) {
                return PageManager._registeredBuilders[String(json.type)].buildFromJson(json);
            }

            throw new Error('Page manager error - type is missing or builder is not registered for this type.');
        }
    }
}
