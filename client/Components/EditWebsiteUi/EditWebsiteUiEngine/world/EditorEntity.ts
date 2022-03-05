import { IBehavior } from '../Behaviors/interfaces/IBehavior';
import { IComponent } from '../Components/interfaces/IComponent';
import { IPage } from '../document_page/interfaces/IPage';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { Transform } from '../Math/Transform';
import { Vector3 } from '../Math/Vector3';
import { IMessageHandler } from '../MessageManager/IMessageHandler';
import { Message } from '../MessageManager/Message';
import { TObject } from '../Objects/TObject';
import { RenderView } from '../Renderer/RenderView';
import { SceneGraph } from './SceneGraph';

/**
 * Null object in the world responable for world state
 */
export class EditorEntity extends TObject implements IMessageHandler {
    private _children: EditorEntity[] = [];
    private _parent: EditorEntity;
    private _isLoaded: boolean = false;
    private _sceneGraph: SceneGraph;
    private _components: IComponent[] = [];
    private _pageConfig: IPage[] = [];
    private _behaviors: IBehavior[] = [];
    private _isVisible: boolean = true;

    private _localMatrix: Matrix4x4 = Matrix4x4.identity();
    private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

    private _isHovering: boolean = false;

    /** The name of this object. */
    public name: string;

    /** The transform of this entity. */
    public transform: Transform = new Transform();

    /**
     * Creates a new entity.
     * @param {strimng} name The name of this entity.
     * @param {EditorEntity} sceneGraph The scenegraph to which this entity belongs.
     */
    public constructor(name: string, sceneGraph?: SceneGraph) {
        super();
        this.name = name;
        this._sceneGraph = sceneGraph;
    }

    /** Returns the parent of this entity. */
    public get parent(): EditorEntity {
        return this._parent;
    }

    /**
     * set parent for entity
     * @param {EditorEntity} newParent
     */
    public set parent(newParent: EditorEntity) {
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
    public addChild(child: EditorEntity): void {
        child._parent = this;
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
            child._parent = undefined;
            this._children.splice(index, 1);
        }
    }

    /**
     * Recursively attempts to retrieve a component with the given name from this entity or its children.
     * @param {String} name The name of the component to retrieve.
     * @return {IComponent}
     */
    public getComponentByName(name: string): IComponent {
        for (const component of this._components) {
            if (component.name === name) {
                return component;
            }
        }

        for (const child of this._children) {
            const component = child.getComponentByName(name);
            if (component !== undefined) {
                return component;
            }
        }

        return undefined;
    }

    /**
     * Recursively attempts to retrieve a behavior with the given name from this entity or its children.
     * @param {strng} name The name of the behavior to retrieve.
     * @return {IBehavior}
     */
    public getBehaviorByName(name: string): IBehavior {
        for (const behavior of this._behaviors) {
            if (behavior.name === name) {
                return behavior;
            }
        }

        for (const child of this._children) {
            const behavior = child.getBehaviorByName(name);
            if (behavior !== undefined) {
                return behavior;
            }
        }

        return undefined;
    }

    /**
     * Recursively attempts to retrieve a child entity with the given name from this entity or its children.
     * @param {string} name The name of the entity to retrieve.
     * @return {EditorEntity}
     */
    public getEntityByName(name: string): EditorEntity {
        if (this.name === name) {
            return this;
        }

        for (const child of this._children) {
            const result = child.getEntityByName(name);
            if (result !== undefined) {
                return result;
            }
        }

        return undefined;
    }

    /**
     * Adds the given component to this entity.
     * @param {IComponent} component The component to be added.
     */
    public addComponent(component: IComponent): void {
        this._components.push(component);
        component.setOwner(this);
    }

    /**
     * Adds the given behavior to this entity.
     * @param {IBehavior} behavior The behavior to be added.
     */
    public addBehavior(behavior: IBehavior): void {
        this._behaviors.push(behavior);
        behavior.setOwner(this);
    }

    /**
     * Adds the given behavior to this entity.
     * @param {config} config The behavior to be added.
     */
    public addconfig(config: IPage): void {
        this._pageConfig.push(config);
        config.setOwner(this);
    }

    /**
     * on message
     * @param {Message} message
     */
    public onMessage(message: Message): void {
        // console.log(MaterialManager.getMaterial('wood'));
        const event: CustomEvent = new CustomEvent('selectObject', {
            detail: {
                name: this.name,
                transform: this.transform,
                components: this._components,
                behaviors: this._behaviors,
                // MatName: this.getMaterialName(this._components[0]),
            },
        });

        /* eslint-disable */
        switch (message.code) {
            case 'MOUSE_DOWN':
                if (this._isHovering) {
                    window.dispatchEvent(event);
                }
                break;
            case 'MOUSE_UP':
                if (this._isHovering) {
                    // console.log(this.getMaterialName(this._components[0]));
                    window.dispatchEvent(event);
                }
                break;

            case `MOUSE_HOVER: ${this.name}`:
                this._isHovering = true;
                break;

            case `MOUSE_HOVER_EXIT: ${this.name}`:
                this._isHovering = false;
                break;
        }
        /* eslint-enable */
    }

    /** Performs loading procedures on this entity. */
    public load(): void {
        this._isLoaded = true;

        Message.subscribe(`MOUSE_HOVER: ${this.name}`, this);
        Message.subscribe(`MOUSE_HOVER_EXIT: ${this.name}`, this);
        Message.subscribe(`MOUSE_DOWN`, this);
        Message.subscribe(`MOUSE_UP`, this);

        for (const p of this._pageConfig) {
            p.load();
        }

        for (const c of this._components) {
            c.load();
        }

        for (const c of this._children) {
            c.load();
        }
    }

    /** Performs pre-update procedures on this entity. */
    public updateReady(): void {
        for (const c of this._components) {
            c.updateReady();
        }

        for (const b of this._behaviors) {
            b.updateReady();
        }

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

        for (const c of this._components) {
            c.update(time);
        }

        for (const b of this._behaviors) {
            b.update(time);
        }

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

        for (const c of this._pageConfig) {
            c.render(renderView);
        }

        for (const c of this._components) {
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
