import { Shaders } from '../GL/Shaders';
import { Scene } from './Scene';

export enum LevelState {
    UNINITIALIZED,
    LOADING,
    UPDATING
}

/**
 * Level
 */
export class Level {
    private _id: number;
    private _name: string;
    private _description: string;
    private _scene: Scene;
    private _state: LevelState = LevelState.UNINITIALIZED;

    /**
     * Class Constructor
     * @param {number} id
     * @param {string} name
     * @param {string} description
     */
    public constructor(id: number, name: string, description: string) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._scene = new Scene();
    }


    /**
     * Get id
     */
    public get id(): number {
        return this._id;
    }

    /**
    * Get name
    */
    public get name(): string {
        return this._name;
    }

    /**
    * Get description
    */
    public get description(): string {
        return this._description;
    }

    /**
    * Get scene
    */
    public get scene(): Scene {
        return this._scene;
    }

    /**
    * load
    */
    public load(): void {
        this._state = LevelState.LOADING;

        this._scene.load();

        this._state = LevelState.UPDATING;
    }

    /**
    * Unload
    */
    public unload(): void {

    }

    /**
    * Update
    * @param {number} time
    */
    public update(time: number): void {
        if (this._state === LevelState.UPDATING) {
            this._scene.update(time);
        }
    }

    /**
     * render
     * @param {Shaders} shader
     */
    public render(shader: Shaders): void {
        if (this._state === LevelState.UPDATING) {
            this._scene.render(shader);
        }
    }

    /**
     * On activate level
     */
    public onActivated(): void {

    }

    /**
    * On deactivate level
    */
    public onDeactivated(): void {

    }
}
