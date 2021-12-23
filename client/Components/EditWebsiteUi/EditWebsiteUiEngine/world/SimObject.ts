import { BaseComponent } from '../Components/BaseComponent';
import { Shaders } from '../GL/Shaders';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { Transform } from '../Math/Transform';
import { Scene } from './Scene';

/**
 * SimObject Classs
 */
export class SimObject {
    private _id: number;
    private _children: SimObject[] = [];
    private _parent: SimObject;
    private _isLoaded: boolean = false;
    private _scene: Scene;
    private _components: BaseComponent[] = [];

    private _localMatrix: Matrix4x4 = Matrix4x4.identity();
    private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

    public name: string;

    public transform: Transform = new Transform();

    /**
     * Class Constructor
     * @param {number} id
     * @param {string} name
     * @param {Scene} scene
     */
    public constructor(id: number, name: string, scene?: Scene) {
        this._id = id;
        this.name = name;
        this._scene = scene;
    }

    /**
     * Get id method
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Get Parent
     */
    public get parent(): SimObject {
        return this._parent;
    }

    /**
     * Get Wolrd Matrix
     */
    public get worldMatrix(): Matrix4x4 {
        return this._worldMatrix;
    }

    /**
     * Is Loaded
     */
    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    /**
     * add SimObject child
     * @param {SimObject} child
     */
    public addChild(child: SimObject): void {
        child._parent = this;
        this._children.push(child);
        child.onAdded(this._scene);
    }

    /**
    * remouveSimObject child
    * @param {SimObject} child
    */
    public removeChild(child: SimObject): void {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            child._parent = undefined;
            this._children.splice(index, 1);
        }
    }

    /**
     * getObjectByName recurservley
     * @param {string} name
     * @return {SimObject}
     */
    public getObjectByName(name: string): SimObject {
        if (this.name === name) {
            return this;
        }

        for (const child of this._children) {
            const result = child.getObjectByName(name);
            if (result !== undefined) {
                return result;
            }
        }

        return undefined;
    }

    /**
     * Add copmponent
     * @param {BaseComponent} component
     */
    public addComponent(component: BaseComponent): void {
        this._components.push(component);
        component.setOwner(this);
    }

    /**
     * Load Method
     */
    public load(): void {
        this._isLoaded = true;

        for (const c of this._components) {
            c.load();
        }
        for (const c of this._children) {
            c.load();
        }
    }

    /**
     *  Update Method
     * @param {number} time
     */
    public update(time: number): void {
        this._localMatrix = this.transform.getTransformationMatrix();
        this.updateWorldMatrix((this._parent !== undefined) ? this._parent.worldMatrix : undefined);

        for (const c of this._components) {
            c.update(time);
        }

        for (const c of this._children) {
            c.update(time);
        }
    }

    /**
     * Render Method
     * @param {Shaders} shader
     */
    public render(shader: Shaders): void {
        for (const c of this._components) {
            c.render(shader);
        }

        for (const c of this._children) {
            c.render(shader);
        }
    }

    /**
     * On added Method
     * @param {Scene} scene
     */
    protected onAdded(scene: Scene): void {
        this._scene = scene;
    }

    /**
     * Update world matrix
     * @param {Matrix4x4} parentWorldMatrix
     */
    private updateWorldMatrix(parentWorldMatrix: Matrix4x4): void {
        if (parentWorldMatrix !== undefined) {
            this._worldMatrix = Matrix4x4.multiply(parentWorldMatrix, this._localMatrix);
        } else {
            this._worldMatrix.copyFrom(this._localMatrix);
        }
    }
}
