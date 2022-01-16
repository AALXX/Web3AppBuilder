import { SimObject } from '../world/simObject';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorData } from './interfaces/IBehaviorData';

/**
 * Base Behavior class
 */
export abstract class BaseBehavior implements IBehavior {
    public name: string;

    protected _data: IBehaviorData;
    protected _owner: SimObject;

    /**
     * class constructor
     * @param {IBehaviorData} data
     */
    public constructor(data: IBehaviorData) {
        this._data = data;
        this.name = this._data.name;
    }

    /**
     * Set owner
     * @param {SimObject} owner
     */
    public setOwner(owner: SimObject): void {
        this._owner = owner;
    }

    /**
     * update ready check
     */
    public updateReady(): void {}

    /**
     * update method
     * @param {number} time
     */
    public update(time: number): void {}

    /**
     * apply method
     * @param {any}  userData
     */
    public apply(userData: any): void {}
}
