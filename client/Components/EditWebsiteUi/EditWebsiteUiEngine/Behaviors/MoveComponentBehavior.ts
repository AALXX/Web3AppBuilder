import { InputManager, Keys, MouseContext } from '../Input/InputManager';
import { IMessageHandler } from '../MessageManager/IMessageHandler';
import { Message } from '../MessageManager/Message';
import { BaseBehavior } from './BaseBehavior';
import { IBehavior } from './interfaces/IBehavior';
import { IBehaviorBuilder } from './interfaces/IBehaviorBuilder';
import { IBehaviorData } from './interfaces/IBehaviorData';

/**
 * Keyboard MovementBehavior Data class
 */
export class MoveComponentBehaviorData implements IBehaviorData {
    public name: string;

    /**
     * set from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.name === undefined) {
            throw new Error('Name must be defined in behavior data.');
        }

        this.name = String(json.name);
    }
}

/**
 * Keyboard MovementBehavior Builder class
 */
export class MoveComponentBehaviorBuilder implements IBehaviorBuilder {
    /**
     *get behavior  type
     */
    public get type(): string {
        return 'ComponentMovement';
    }

    /**
     * set datat from json file
     * @param {any} json
     * @return {IBehaviorData}
     */
    public buildFromJson(json: any): IBehavior {
        const data = new MoveComponentBehaviorData();
        data.setFromJson(json);
        return new KeyboardMovementBehavior(data);
    }
}

/**
 * KeyboardMovementBehavior class
 */
export class KeyboardMovementBehavior extends BaseBehavior implements IMessageHandler {
    /**
     * class constructor
     * @param {KeyboardMovementBehaviorData} data
     */
    public constructor(data: MoveComponentBehaviorData) {
        super(data);

        Message.subscribe('MOUSE_DOWN', this);
        Message.subscribe('MOUSE_UP', this);
    }
    private _isHolding: boolean = false;

    /**
     * update Method
     * @param {number} time
     */
    public update(time: number): void {
        if (InputManager.isKeyDown(Keys.ARROW_LEFT)) {
            // this._owner.transform.position.y += this.speed;
        }

        if (this._isHolding) {
            this._owner.transform.position.x = InputManager.getMousePosition().x;
            this._owner.transform.position.y = InputManager.getMousePosition().y;
        }

        super.update(time);
    }

    /**
     * on message function
     * @param {Message} message
     */
    public onMessage(message: Message): void {
        // const context = message.context as MouseContext;

        /* eslint-disable */
        switch (message.code) {
            case 'MOUSE_DOWN':
                // console.log(`Pos: [${context.position.x},${context.position.y}]`);
                this._isHolding = true;
                break;

            case 'MOUSE_UP':
                console.log(this._owner.transform.position);
                this._isHolding = false;

                break;
        }
        /* eslint-enable */
    }
}
