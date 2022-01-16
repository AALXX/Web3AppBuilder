import { Shaders } from '../GL/Shaders';
import { SimObject } from '../world/simObject';
import { IComponent } from './interfaces/IComponent';
import { IComponentData } from './interfaces/IComponentData';

/**
 * Base compoenent Class resposible with rendering/updating
 */
export abstract class BaseComponent implements IComponent {
    protected _owner: SimObject;
    protected _data: IComponentData;

    public name: string;

    /**
     * class constructor
     * @param {IComponentData} data
     */
    public constructor(data: IComponentData) {
        this._data = data;
        this.name = data.name;
    }

    /**
     * get owner
     */
    public get owner(): SimObject {
        return this._owner;
    }

    /**
     * set owner
     * @param {SimObject} owner
     */
    public setOwner(owner: SimObject): void {
        this._owner = owner;
    }

    /**
     * load
     */
    public load(): void {}

    /**
     * update method
     * @param {number} time
     */
    public update(time: number): void {}

    /**
     * render method
     * @param {Shaders} shader
     */
    public render(shader: Shaders): void {}
}
