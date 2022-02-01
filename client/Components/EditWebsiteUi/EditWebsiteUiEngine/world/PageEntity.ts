import { IPage } from '../document_page/interfaces/IPage';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { Transform } from '../Math/Transform';
import { Vector3 } from '../Math/Vector3';
import { TObject } from '../Objects/TObject';
import { RenderView } from '../Renderer/RenderView';
import { EditorEntity } from './EditorEntity';
import { SceneGraph } from './SceneGraph';

/**
 * Null object in the world responable for world state
 */
export class PageEntity extends TObject {
    private _children: (EditorEntity | PageEntity)[] = [];
    private _parent: EditorEntity | PageEntity;
    private _isLoaded: boolean = false;
    private _sceneGraph: SceneGraph;
    private _config: IPage[] = [];
    private _isVisible: boolean = true;

    private _localMatrix: Matrix4x4 = Matrix4x4.identity();
    private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

    /** The name of this object. */
    public name: string;

    /** The transform of this entity. */
    public transform: Transform = new Transform();

    /**
     * Creates a new entity.
     * @param {strimng} name The name of this entity.
     * @param {PageEntity} sceneGraph The scenegraph to which this entity belongs.
     */
    public constructor(name: string, sceneGraph?: SceneGraph) {
        super();
        this.name = name;
        this._sceneGraph = sceneGraph;
    }

    /** Returns the parent of this entity. */
    public get parent(): EditorEntity | PageEntity {
        return this._parent;
    }

    /**
     * set parent for entity
     * @param {EditorEntity | PageEntity} newParent
     */
    public set parent(newParent: EditorEntity | PageEntity) {
        this._parent = newParent;
    }

    /** Returns the world transformation matrix of this entity. */
    public get worldMatrix(): Matrix4x4 {
        return this._worldMatrix;
    }

    /** Indicates if this entity has been loaded. */
    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    /** Indicates if this entity is currently visible. */
    public get isVisible(): boolean {
        return this._isVisible;
    }

    /** Sets visibility of this entity.
     * @param {boolean} value
     */
    public set isVisible(value: boolean) {
        this._isVisible = value;
    }

    /**
     * Adds the provided entity as a child of this one.
     * @param {EditorEntity} child The child to be added.
     */
    public addChild(child: EditorEntity | PageEntity): void {
        child.parent = this;
        this._children.push(child);
        child.onAdded(this._sceneGraph);
    }

    /**
     * Attempts to remove the provided entity as a child of this one, if it is in fact
     * a child of this entity. Otherwise, nothing happens.
     * @param {EditorEntity} child The child to be added.
     */
    public removeChild(child: EditorEntity): void {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            child.parent = undefined;
            this._children.splice(index, 1);
        }
    }

    /**
     * Recursively attempts to retrieve a child entity with the given name from this entity or its children.
     * @param {string} name The name of the entity to retrieve.
     * @return {PageEntity}
     */
    // public getPageByName(name: string): PageEntity {
    //     if (this.name === name) {
    //         return this;
    //     }

    //     for (const child of this._children) {
    //         const result = child.getPageByName(name);
    //         if (result !== undefined) {
    //             return result;
    //         }
    //     }

    //     return undefined;
    // }

    /** Performs loading procedures on this entity. */
    public load(): void {
        this._isLoaded = true;
        console.log('cum');
        // console.log(this._config);

        // for (const c of this._config) {
        //     c.load();
        // }

        for (const c of this._children) {
            c.load();
        }
    }

    /**
     * Adds the given config to this entity.
     * @param {IPage} config The config to be added.
     */
    public addconfig(config: IPage): void {
        this._config.push(config);

        config.setOwner(this);
    }

    /** Performs pre-update procedures on this entity. */
    public updateReady(): void {
        for (const c of this._children) {
            c.updateReady();
        }
    }

    /**
     * Performs update procedures on this entity (recurses through children,
     * components and behaviors as well).
     * @param {number} time The delta time in milliseconds since the last update call.
     */
    public update(time: number): void {
        this._localMatrix = this.transform.getTransformationMatrix();
        this.updateWorldMatrix(this._parent !== undefined ? this._parent.worldMatrix : undefined);
        for (const c of this._children) {
            c.update(time);
        }
    }

    /**
     * Renders this entity and its children.
     * @param {RenderView} renderView
     */
    public render(renderView: RenderView): void {
        if (!this._isVisible) {
            return;
        }

        for (const c of this._config) {
            c.render(renderView);
        }

        for (const c of this._children) {
            c.render(renderView);
        }
    }

    /** Returns the world position of this entity.
     * @return {Vector3}
     */
    public getWorldPosition(): Vector3 {
        return new Vector3(this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14]);
    }

    /**
     * Called when this entity is added to a scene graph.
     * @param {SceneGraph} sceneGraph The scenegraph to which this entity was added.
     */
    public onAdded(sceneGraph: SceneGraph): void {
        this._sceneGraph = sceneGraph;
    }

    /**
     * update wrld matric
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
