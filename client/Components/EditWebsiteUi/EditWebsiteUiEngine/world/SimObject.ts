import { IBehavior } from '../Behaviors/interfaces/IBehavior';
import { IComponent } from '../Components/interfaces/IComponent';
import { Shaders } from '../GL/Shaders';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { Transform } from '../Math/Transform';
import { Scene } from './scene';

/**
 * Null object in the world responable for world state
 */
export class SimObject {
    private _id: number;
    private _children: SimObject[] = [];
    private _parent: SimObject;
    private _isLoaded: boolean = false;
    private _scene: Scene;
    private _components: IComponent[] = [];
    private _behaviors: IBehavior[] = [];

    private _localMatrix: Matrix4x4 = Matrix4x4.identity();
    private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

    public name: string;

    public transform: Transform = new Transform();

    /**
     * class constructor
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
     * get id
     */
    public get id(): number {
        return this._id;
    }

    /**
     * get parent
     */
    public get parent(): SimObject {
        return this._parent;
    }

    /**
     * get world matrix
     */
    public get worldMatrix(): Matrix4x4 {
        return this._worldMatrix;
    }

    /**
     * is loaded check
     */
    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    /**
     * add child
     * @param {SimObject} child
     */
    public addChild(child: SimObject): void {
        child._parent = this;
        this._children.push(child);
        child.onAdded(this._scene);
    }

    /**
     * remove child
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
     * get Object By Name
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
     * add component
     * @param {IComponent} component
     */
    public addComponent(component: IComponent): void {
        this._components.push(component);
        component.setOwner(this);
    }

    /**
     * add behavior
     * @param {IBehavior} behavior
     */
    public addBehavior(behavior: IBehavior): void {
        this._behaviors.push(behavior);
        behavior.setOwner(this);
    }

    /**
     * load method
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
     * update method
     * @param {number} time
     */
    public update(time: number): void {
        this._localMatrix = this.transform.getTransformationMatrix();
        this.updateWorldMatrix(this._parent !== undefined ? this._parent.worldMatrix : undefined);

        for (const component of this._components) {
            component.update(time);
        }

        for (const behavior of this._behaviors) {
            behavior.update(time);
        }

        for (const child of this._children) {
            child.update(time);
        }
    }

    /**
     * render method
     * @param {Shader} shader
     */
    public render(shader: Shaders): void {
        for (const component of this._components) {
            component.render(shader);
        }

        for (const child of this._children) {
            child.render(shader);
        }
    }

    /**
     * on added event
     * @param {Scene} scene
     */
    protected onAdded(scene: Scene): void {
        this._scene = scene;
    }

    /**
     * it updates the  World Matrix
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
