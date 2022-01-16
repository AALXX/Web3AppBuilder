import { Vector2 } from '../Math/Vector2';
import { Message } from '../MessageManager/Message';

export enum Keys {
    ARROW_LEFT = 37,
    ARROW_UP = 38,
    ARROW_RIGHT = 39,
    ARROW_DOWN = 40,
}

/**
 * mouse context class
 */
export class MouseContext {
    public leftDown: boolean;
    public rightDown: boolean;
    public position: Vector2;

    /**
     * class cosntructor
     * @param {boolean} leftDown
     * @param {boolean} rightDown
     * @param {Vector2} position
     */
    public constructor(leftDown: boolean, rightDown: boolean, position: Vector2) {
        this.leftDown = leftDown;
        this.rightDown = rightDown;
        this.position = position;
    }
}

/**
 * InputManager claass
 */
export class InputManager {
    private static _keys: boolean[] = [];

    private static _previousMouseX: number;
    private static _previousMouseY: number;
    private static _mouseX: number;
    private static _mouseY: number;
    private static _leftDown: boolean = false;
    private static _rightDown: boolean = false;

    /**
     * initizalize the input manager
     */
    public static initialize(): void {
        for (let i = 0; i < 255; ++i) {
            InputManager._keys[i] = false;
        }

        window.addEventListener('keydown', InputManager.onKeyDown);
        window.addEventListener('keyup', InputManager.onKeyUp);
        window.addEventListener('mousemove', InputManager.onMouseMove);
        window.addEventListener('mousedown', InputManager.onMouseDown);
        window.addEventListener('mouseup', InputManager.onMouseUp);
    }

    /**
     * is key down check
     * @param {Keys} key
     * @return {boolean}
     */
    public static isKeyDown(key: Keys): boolean {
        return InputManager._keys[key];
    }

    /**
     * get mouse pos
     * @return {Vector2}
     */
    public static getMousePosition(): Vector2 {
        return new Vector2(this._mouseX, this._mouseY);
    }

    /**
     * onKey down check
     * @param {KeyboardEvent} event
     * @return {boolean}
     */
    private static onKeyDown(event: KeyboardEvent): boolean {
        InputManager._keys[event.keyCode] = true;
        return true;
        // event.preventDefault();
        // event.stopPropagation();
        // return false;
    }

    /**
     * on keyup check
     * @param {KeyboardEvent} event
     * @return {boolean}
     */
    private static onKeyUp(event: KeyboardEvent): boolean {
        InputManager._keys[event.keyCode] = false;
        return true;
        // event.preventDefault();
        // event.stopPropagation();
        // return false;
    }

    /**
     * on mouse move check
     * @param {MouseEvent} event
     */
    private static onMouseMove(event: MouseEvent): void {
        InputManager._previousMouseX = InputManager._mouseX;
        InputManager._previousMouseY = InputManager._mouseY;
        InputManager._mouseX = event.clientX;
        InputManager._mouseY = event.clientY;
    }

    /**
     * on mouse down check
     * @param {MouseEvent} event
     */
    private static onMouseDown(event: MouseEvent): void {
        if (event.button === 0) {
            this._leftDown = true;
        } else if (event.button === 2) {
            this._rightDown = true;
        }

        Message.send('MOUSE_DOWN', this, new MouseContext(InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosition()));
    }

    // eslint-disable-next-line require-jsdoc
    private static onMouseUp(event: MouseEvent): void {
        if (event.button === 0) {
            this._leftDown = false;
        } else if (event.button === 2) {
            this._rightDown = false;
        }

        Message.send('MOUSE_UP', this, new MouseContext(InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosition()));
    }
}
