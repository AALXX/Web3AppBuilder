import { RenderView } from '../Renderer/RenderView';
import { EditorEntity } from './EditorEntity';

/**
 * A scene graph, which is responsible for managing the heirarchy of objects in a scene (essentially,
 * it is the scene itself).
 */
export class SceneGraph {
    private _root: EditorEntity;

    /** Creates a new SceneGraph */
    public constructor() {
        this._root = new EditorEntity('__ROOT__', this);
    }

    /** Returns the root object. */
    public get root(): EditorEntity {
        return this._root;
    }

    /** Indicates if this scene is loaded. */
    public get isLoaded(): boolean {
        return this._root.isLoaded;
    }

    /**
     * Adds an entity to the root entity of this scene graph.
     * @param {EditorEntity} entity The entity to be added.
     */
    public addObject(entity: EditorEntity): void {
        this._root.addChild(entity);
    }

    /**
     * Recursively searches this scene graph for an entity with the provided name.
     * @param {string} name The name of the entity to retrieve.
     * @return {EditorEntity}
     */
    public getEntityByName(name: string): EditorEntity {
        return this._root.getEntityByName(name);
    }

    /** Loads this scene graph. */
    public load(): void {
        this._root.load();
    }

    /**
     * Performs update procedures on this scene graph.
     * @param {number} time The delta time in milliseconds since the last update.
     */
    public update(time: number): void {
        this._root.update(time);
    }

    /**
     * Renders this scene graph.
     * @param {RenderView} renderView
     */
    public render(renderView: RenderView): void {
        this._root.render(renderView);
    }
}
