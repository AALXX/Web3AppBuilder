import { EditorEntity } from '../world/EditorEntity';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorData } from './interfaces/IBehaviorData';

/**
 * Base Behavior class
 */
export abstract class BaseBehavior implements IBehavior {
    public name: string;

    /**
     * The data associated with this behavior.
     */
    protected _data: IBehaviorData;

    /**
     * The owning entity of this behavior.
     */
    protected _owner: EditorEntity;

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
     * @param {EditorEntity} owner
     */
    public setOwner(owner: EditorEntity): void {
        this._owner = owner;
    }

    /**
     * Performs pre-update procedures on this behavior.
     */
    public updateReady(): void {}

    /**
     * Performs update procedures on this behavior.
     * @param {number} time The delta time in milliseconds since the last update.
     */
    public update(time: number): void {}

    /**
     * apply method
     * @param {any}  userData
     */
    public apply(userData: any): void {}
}
