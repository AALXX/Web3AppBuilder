import { Vector3 } from '../Math/Vector3';
import { BaseBehavior } from './BaseBehavior';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorBuilder } from './interfaces/IBehaviorBuilder';
import { IBehaviorData } from './interfaces/IBehaviorData';

/**
 * rotation behavior class
 */
export class RotationBehaviorData implements IBehaviorData {
    public name: string;

    public rotation: Vector3 = Vector3.zero;

    /**
     * Set this data from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.name === undefined) {
            throw new Error('Name must be defined in behavior data');
        }

        this.name = String(json.name);

        if (json.rotation !== undefined) {
            this.rotation.setFromJson(json.rotation);
        }
    }
}

/**
 * Rotation Behavior Builder class
 */
export class RotationBehaviorBuilder implements IBehaviorBuilder {
    /**
     * behavior type
     */
    public get type(): string {
        return 'rotation';
    }

    /**
     * build form json file data
     * @param {any} json
     * @return {IBehavior}
     */
    public buildFromJson(json: any): IBehavior {
        const data = new RotationBehaviorData();
        console.log(json);
        data.setFromJson(json);
        return new RotationBehavior(data);
    }
}

/**
 * Rotation Behavior class
 */
export class RotationBehavior extends BaseBehavior {
    private _rotation: Vector3;

    /**
     * Class constructor
     * @param {RotationBehavior} data
     */
    public constructor(data: RotationBehaviorData) {
        super(data);
        this._rotation = data.rotation;
    }

    /**
     * Update Method
     * @param {number} time
     */
    public update(time: number): void {
        this._owner.transform.rotation.add(this._rotation);

        super.update(time);
    }
}
