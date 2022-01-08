import { BehaviorManager } from '../Behaviors/BehaviorManager';
import { ComponentManager } from '../Components/ComponentsManager';
import { Shaders } from '../GL/Shaders';
import { Scene } from './scene';
import { SimObject } from './simObject';

export enum LevelState {
    UNINITIALIZED,
    LOADING,
    UPDATING,
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
    private _globalId: number = -1;

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
     * Level init
     * @param {any} levelData
     */
    public initialize(levelData: any): void {
        if (levelData.objects === undefined) {
            throw new Error('Level init error: object ot found');
        }

        for (const o in levelData.objects) {
            if (levelData.objects !== undefined) {
                const object = levelData.objects[o];
                this.loadSimObject(object, this.scene.root);
            }
        }
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
    public unload(): void {}

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
    public onActivated(): void {}

    /**
     * On deactivate level
     */
    public onDeactivated(): void {}

    /**
     * loads simobject
     * @param {any} dataSection
     * @param {SimObject} parent
     */
    public loadSimObject(dataSection: any, parent: SimObject) {
        let name: string;

        if (dataSection.name !== undefined) {
            name = String(dataSection.name);
        }

        this._globalId++;
        const simObject = new SimObject(this._globalId, name, this._scene);

        if (dataSection.transform !== undefined) {
            simObject.transform.setFromJson(dataSection.transform);
        }

        if (dataSection.components !== undefined) {
            for (const c in dataSection.components) {
                if (c !== undefined) {
                    const data = dataSection.components[c];
                    const component = ComponentManager.extractComponent(data);
                    simObject.addComponent(component);
                }
            }
        }

        if (dataSection.behaviors !== undefined) {
            for (const b in dataSection.behaviors) {
                if (b !== undefined) {
                    const data = dataSection.behaviors[b];
                    const behavior = BehaviorManager.extractBehavior(data);
                    console.log(simObject);
                    simObject.addBehavior(behavior);
                }
            }
        }

        if (dataSection.children !== undefined) {
            for (const c in dataSection.children) {
                if (dataSection.children !== undefined) {
                    const object = dataSection.children[c];
                    this.loadSimObject(object, simObject);
                }
            }
        }

        if (parent !== undefined) {
            parent.addChild(simObject);
        }
    }
}
