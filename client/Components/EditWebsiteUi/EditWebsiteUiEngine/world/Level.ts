import { BehaviorManager } from '../Behaviors/BehaviorManager';
import { ComponentManager } from '../Components/ComponentsManager';
import { PageManager } from '../document_page/PageManager';
import { Vector3 } from '../Math/Vector3';
import { RenderView } from '../Renderer/RenderView';
import { Dictionary } from '../Types';
import { BaseCamera } from './Camera/BaseCamera';
import { OrtogarphicCamera } from './Camera/OrtogarphicCamera';
import { EditorEntity } from './EditorEntity';
import { SceneGraph } from './SceneGraph';

/* eslint-disable */

/**
 * Represents the basic level state.
 */
export enum LevelState {
    /** The level is not yet initialized. */
    UNINITIALIZED,

    /** The level is currently loading. */
    LOADING,

    /** The level is loaded and is currently updating. */
    UPDATING,
}
/* eslint-enable */

/**
 * Represents a single level in the world. Levels are loaded and unloaded as the player
 * progresses through the game. An open world would be achieved by overriding this class
 * and adding/removing objects dynamically based on player position, etc.
 */
export class Level {
    private _name: string;
    private _description: string;
    private _sceneGraph: SceneGraph;
    private _state: LevelState = LevelState.UNINITIALIZED;
    private _registeredCameras: Dictionary<BaseCamera> = {};
    private _activeCamera: BaseCamera;
    private _defaultCameraName: string;

    /**
     * Creates a new level.
     * @param {string} name The name of this level.
     * @param {string} description A brief description of this level.
     * Could be used on level selection screens for some games.
     */
    public constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
        this._sceneGraph = new SceneGraph();
    }

    /** The name of this level. */
    public get name(): string {
        return this._name;
    }

    /** The description of this level. */
    public get description(): string {
        return this._description;
    }

    /** The SceneGraph of this level. */
    public get sceneGraph(): SceneGraph {
        return this._sceneGraph;
    }

    /** The currently active camera. */
    public get activeCamera(): BaseCamera {
        return this._activeCamera;
    }

    /** Indicates if this level is loaded. */
    public get isLoaded(): boolean {
        return this._state === LevelState.UPDATING;
    }

    /**
     * Performs initialization routines on this level.
     * @param {any} jsonData The JSON-formatted data to initialize this level with.
     */
    public initialize(jsonData: any): void {
        if (jsonData.page === undefined) {
            throw new Error('project initialization error: page not present.');
        }

        this.loadPage(jsonData.page, this._sceneGraph.root);

        if (jsonData.page.objects === undefined) {
            throw new Error('project initialization error: objects not present.');
        }

        if (jsonData.page.defaultCamera !== undefined) {
            this._defaultCameraName = String(jsonData.page.defaultCamera);
        }

        for (const o in jsonData.page.objects) {
            if (o !== undefined) {
                const obj = jsonData.page.objects[o];
                this.loadEntity(obj, this._sceneGraph.root);
            }
        }
    }

    /** Loads this level. */
    public load(): void {
        this._state = LevelState.LOADING;

        this._sceneGraph.load();
        this._sceneGraph.root.updateReady();

        // Get registered cameras. If there aren't any, register one automatically.
        // Otherwise, look for the first one and make it active.
        // TODO: Add active camera to level config, assign by name.
        if (this._defaultCameraName !== undefined) {
            const obj = this._sceneGraph.getEntityByName(this._defaultCameraName);
            if (obj === undefined) {
                throw new Error('Default camera not found:' + this._defaultCameraName);
            } else {
                // NOTE: If detected, the camera should already be registered at this point.
            }
        } else {
            const cameraKeys = Object.keys(this._registeredCameras);
            if (cameraKeys.length > 0) {
                this._activeCamera = this._registeredCameras[cameraKeys[0]];
            } else {
                const defaultCamera = new OrtogarphicCamera('DEFAULT_CAMERA', this._sceneGraph);
                this._sceneGraph.addObject(defaultCamera);
                this.registerCamera(defaultCamera);
                this._activeCamera = defaultCamera;
            }
        }

        this._state = LevelState.UPDATING;
    }

    /** Unloads this level. */
    public unload(): void {}

    /**
     * Updates this level.
     * @param {number} time The delta time in milliseconds since the last update.
     */
    public update(time: number): void {
        if (this._state === LevelState.UPDATING) {
            this._sceneGraph.update(time);
        }
    }

    /**
     * Renders this level.
     * @param {RenderView} renderView
     */
    public render(renderView: RenderView): void {
        if (this._state === LevelState.UPDATING) {
            this._sceneGraph.render(renderView);
        }
    }

    /** Called when this level is activated. */
    public onActivated(): void {}

    /** Called when this level is deactivated. */
    public onDeactivated(): void {}

    /**
     * Registers the provided camera with this level. Automatically sets as the active camera
     * if no active camera is currently set.
     * @param {BaseCamera} camera The camera to register.
     */
    public registerCamera(camera: BaseCamera): void {
        if (this._registeredCameras[camera.name] === undefined) {
            this._registeredCameras[camera.name] = camera;
            if (this._activeCamera === undefined) {
                this._activeCamera = camera;
            }
        } else {
            console.warn(`A camera named '${camera.name}' has already been registered. New camera not registered.`);
        }
    }

    /**
     * Unregisters the provided camera with this level.
     * @param {BaseCamera} camera The camera to unregister.
     */
    public unregisterCamera(camera: BaseCamera): void {
        if (this._registeredCameras[camera.name] !== undefined) {
            this._registeredCameras[camera.name] = undefined;
            if (this._activeCamera === camera) {
                // NOTE: auto-activate the next camera in line?
                this._activeCamera = undefined;
            }
        } else {
            console.warn(`No camera named ${camera.name} has been registered. Camera not unregistered.`);
        }
    }

    /**
     * load base page and it's config
     * @param {any} dataSection
     * @param {EditorEntity} parent
     */
    public loadPage(dataSection: any, parent: EditorEntity) {
        let name: string;
        if (dataSection.pageConfig.name !== undefined) {
            name = String(dataSection.pageConfig.name);
        }
        const entity: EditorEntity = new EditorEntity(name, this._sceneGraph);

        entity.transform.position = new Vector3((window.innerWidth - 350) / 2, window.innerHeight / 2, -1);

        if (dataSection.pageConfig !== undefined) {
            const data = dataSection.pageConfig;
            const pageConfig = PageManager.extractPageConfig(data);
            entity.addconfig(pageConfig);
        }

        if (parent !== undefined) {
            parent.addChild(entity);
        }
    }

    /**
     * Loads an ertity using the data section provided. Attaches to the provided parent.
     * @param {any} dataSection The data section to load from.
     * @param {EditorEntity} parent The parent object to attach to.
     */
    private loadEntity(dataSection: any, parent: EditorEntity): void {
        let name: string;
        if (dataSection.name !== undefined) {
            name = String(dataSection.name);
        }

        let entity: EditorEntity;

        // TODO: Use factories
        if (dataSection.type !== undefined) {
            if (dataSection.type == 'ortographicCamera') {
                entity = new OrtogarphicCamera(name, this._sceneGraph);
                this.registerCamera(entity as BaseCamera);
            } else {
                throw new Error('Unsupported type ' + dataSection.type);
            }
        } else {
            entity = new EditorEntity(name, this._sceneGraph);
        }

        if (dataSection.transform !== undefined) {
            entity.transform.setFromJson(dataSection.transform);
        }

        if (dataSection.components !== undefined) {
            for (const c in dataSection.components) {
                if (c !== undefined) {
                    const data = dataSection.components[c];
                    const component = ComponentManager.extractComponent(data);
                    entity.addComponent(component);
                }
            }
        }

        if (dataSection.behaviors !== undefined) {
            for (const b in dataSection.behaviors) {
                if (b !== undefined) {
                    const data = dataSection.behaviors[b];
                    const behavior = BehaviorManager.extractBehavior(data);
                    entity.addBehavior(behavior);
                }
            }
        }

        if (dataSection.children !== undefined) {
            for (const o in dataSection.children) {
                if (o !== undefined) {
                    const obj = dataSection.children[o];
                    this.loadEntity(obj, entity);
                }
            }
        }

        if (parent !== undefined) {
            parent.addChild(entity);
        }
    }
}
