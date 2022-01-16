import { InputManager, Keys } from '../Input/InputManager';
import { BaseBehavior } from './BaseBehavior';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorBuilder } from './interfaces/IBehaviorBuilder';
import { IBehaviorData } from './interfaces/IBehaviorData';

/**
 * Keyboard MovementBehavior Data class
 */
export class KeyboardMovementBehaviorData implements IBehaviorData {
    public name: string;
    public speed: number = 0.1;

    /**
     * set from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.name === undefined) {
            throw new Error('Name must be defined in behavior data.');
        }

        this.name = String(json.name);

        if (json.speed !== undefined) {
            this.speed = Number(json.speed);
        }
    }
}

/**
 * Keyboard MovementBehavior Builder class
 */
export class KeyboardMovementBehaviorBuilder implements IBehaviorBuilder {
    /**
     *get behavior  type
     */
    public get type(): string {
        return 'keyboardMovement';
    }

    /**
     * set datat from json file
     * @param {any} json
     * @return {IBehaviorData}
     */
    public buildFromJson(json: any): IBehavior {
        const data = new KeyboardMovementBehaviorData();
        data.setFromJson(json);
        return new KeyboardMovementBehavior(data);
    }
}

/**
 * KeyboardMovementBehavior class
 */
export class KeyboardMovementBehavior extends BaseBehavior {
    public speed: number = 0.1;

    /**
     * class constructor
     * @param {KeyboardMovementBehaviorData} data
     */
    public constructor(data: KeyboardMovementBehaviorData) {
        super(data);

        this.speed = data.speed;
    }

    /**
     * update Method
     * @param {number} time
     */
    public update(time: number): void {
        if (InputManager.isKeyDown(Keys.ARROW_LEFT)) {
            this._owner.transform.position.x -= this.speed;
        }
        if (InputManager.isKeyDown(Keys.ARROW_RIGHT)) {
            this._owner.transform.position.x += this.speed;
        }
        if (InputManager.isKeyDown(Keys.ARROW_UP)) {
            this._owner.transform.position.y -= this.speed;
        }
        if (InputManager.isKeyDown(Keys.ARROW_DOWN)) {
            this._owner.transform.position.y += this.speed;
        }

        super.update(time);
    }
}
