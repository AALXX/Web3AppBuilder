import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';

/**
 * Keep tracking of all component builders
 */
export class ComponentManager {
    private static _registeredBuilders: { [type: string]: IComponentBuilder } = {};

    /**
     *register component builder
     * @param {IComponentBuilder} builder
     */
    public static registerBuilder(builder: IComponentBuilder): void {
        ComponentManager._registeredBuilders[builder.type] = builder;
    }

    /**
     * extract component from json file
     * @param {any} json
     * @return {IComponent}
     */
    public static extractComponent(json: any): IComponent {
        if (json.type !== undefined) {
            if (ComponentManager._registeredBuilders[String(json.type)] !== undefined) {
                return ComponentManager._registeredBuilders[String(json.type)].buildFromJson(json);
            }
        }

        throw new Error('Component manager error - type is missing or builder is not registered for this type.');
    }
}
