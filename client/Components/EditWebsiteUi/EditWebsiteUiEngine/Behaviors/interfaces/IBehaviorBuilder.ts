import { IBehavior } from './IBehavior';

export interface IBehaviorBuilder {
    /**
     * they type of the behavior
     */
    readonly type: string;

    /**
     * builds behavior from json
     * @param {any} json
     */
    buildFromJson(json: any): IBehavior;
}
