import { Shaders } from '../GL/Shaders';
import { SimObject } from '../world/SimObject';

/**
 * Base compoenent Class resposible with rendering/updating
 */
export abstract class BaseComponent {
    protected _owner: SimObject;

    public name: string;


    /**
     * Class contructor
     * @param {string} name
     */
    public constructor(name: string) {

    }

    /**
     * get owner
     */
    public get owner(): SimObject {
        return this._owner;
    }

    /**
     * set  owner
     * @param {SimObject} owner
     */
    public setOwner(owner: SimObject): void {
        this._owner = owner;
    }

    /**
     * load
     */
    public load(): void {

    }

    /**
     * Update
     * @param {number} time
     */
    public update(time: number): void {

    }


    /**
     * render
     * @param {Shaders} shader
     */
    public render(shader: Shaders): void {

    }
}
