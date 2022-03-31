import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorBuilder } from './interfaces/IBehaviorBuilder';

/**
 *
 */
export class BehaviorManager {
    private static _registeredBuilders: { [type: string]: IBehaviorBuilder } = {};

    /**
     *register component builder
     * @param {IComponentBuilder} builder
     */
    public static registerBuilder(builder: IBehaviorBuilder): void {
        BehaviorManager._registeredBuilders[builder.type] = builder;
    }

    /**
     * extract behavior from json file
     * @param {any} json
     * @return {IBehavior}
     */
    public static extractBehavior(json: any): IBehavior {
        if (json.type !== undefined) {
            if (BehaviorManager._registeredBuilders[String(json.type)] !== undefined) {
                return BehaviorManager._registeredBuilders[String(json.type)].buildFromJson(json);
            }

            throw new Error('Behavior manager error - type is missing or builder is not registered for this type.');
        }
    }
}
