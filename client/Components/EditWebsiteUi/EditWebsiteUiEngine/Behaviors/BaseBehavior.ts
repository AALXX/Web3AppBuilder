import { SimObject } from '../world/SimObject';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorData } from './interfaces/IBehaviorData';

/**
 * Base Behavior class
 */
export abstract class BaseBehavior implements IBehavior {
    name: string;

    protected _data: IBehaviorData;
    protected _owner: SimObject;

    /** class constructo
     * @param {IBehaviorData} data
     */
    public constructor(data: IBehaviorData) {
        this._data = data;
        this.name = this._data.name;
    }

    /**
     * set owner mthon
     * @param {SimObject} owner
     */
    public setOwner(owner: SimObject): void {
        this._owner = owner;
    }

    /**
     * update method
     * @param {number} time
     */
    public update(time: number): void {}

    /**
     * applay method
     * @param {anu} userData
     */
    public apply(userData: any): void {}
}
