import { Shaders } from '../GL/Shaders';
import { SimObject } from './SimObject';

/**
 * Scene class
 */
export class Scene {
    private _rootObject: SimObject;

    /**
     * Clas constructor
     */
    public constructor() {
        this._rootObject = new SimObject(0, '__ROOT__', this);
    }

    /**
     * Get root
     */
    public get rootObject(): SimObject {
        return this._rootObject;
    }

    /**
     * Get isloaded
     */
    public get isLoaded(): boolean {
        return this._rootObject.isLoaded;
    }

    /**
     * Add Object
     * @param {SimObject} object
     */
    public addObject(object: SimObject): void {
        this._rootObject.addChild(object);
    }

    /**
     * getObjectByName Method
     * @param {string} name
     * @return {SimObject}
     */
    public getObjectByName(name: string): SimObject {
        return this._rootObject.getObjectByName(name);
    }

    /**
     * Load Method
     */
    public load(): void {
        this._rootObject.load();
    }


    /**
     * Update method
     * @param {number} time
     */
    public update(time: number): void {
        this._rootObject.update(time);
    }

    /**
    * Render Method
    * @param {Shaders} shader
    */
    public render(shader: Shaders): void {
        this._rootObject.render(shader);
    }
}
