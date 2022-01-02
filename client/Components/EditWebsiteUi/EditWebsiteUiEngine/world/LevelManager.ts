import { AssetsManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../AssetsManager/AssetsManager';
import { JsonAsset } from '../AssetsManager/JsonAssetLoader';
import { Shaders } from '../GL/Shaders';
import { IMessageHandler } from '../MessageManager/IMessageHandler';
import { Message } from '../MessageManager/Message';
import { Level } from './Level';

/**
 * Level Manager
 */
export class LevelManager implements IMessageHandler {
    private static _globalZoneID: number = -1;
    // private static _levels: { [id: number]: Level } = {};
    private static _registeredLevels: { [id: number]: string } = {};
    private static _activeZone: Level;
    private static _instance: LevelManager;

    /** Class constructor */
    private constructor() {}

    /**
     * registrered zones initializator
     */
    public static initialize(): void {
        LevelManager._instance = new LevelManager();

        // ! Temporary
        LevelManager._registeredLevels[0] = 'http://localhost:9000/kw8rybzkj4ova9uyj1/TestProject.json';
    }

    /**
     * ChangeLevel
     * @param {number} id
     */
    public static changeLevel(id: number): void {
        if (LevelManager._activeZone !== undefined) {
            LevelManager._activeZone.onDeactivated();
            LevelManager._activeZone.unload();
            LevelManager._activeZone = undefined;
        }

        if (LevelManager._registeredLevels[id] !== undefined) {
            if (AssetsManager.isAssetLoaded(LevelManager._registeredLevels[id])) {
                const asset = AssetsManager.getAsset(LevelManager._registeredLevels[id]);
                LevelManager.loadLevel(asset);
            } else {
                Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + LevelManager._registeredLevels[id], LevelManager._instance);
                AssetsManager.loadAsset(LevelManager._registeredLevels[id]);
            }
        } else {
            throw new Error(`level id: ${id} does not exist `);
        }
    }

    /**
     * Update
     * @param {number} time
     */
    public static update(time: number): void {
        if (LevelManager._activeZone !== undefined) {
            LevelManager._activeZone.update(time);
        }
    }

    /**
     * rendering
     * @param {Shaders} shader
     */
    public static render(shader: Shaders): void {
        if (LevelManager._activeZone !== undefined) {
            LevelManager._activeZone.render(shader);
        }
    }

    /**
     *  OnMessage method
     * @param {Message} message
     */
    onMessage(message: Message): void {
        if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED)) {
            const asset = message.context as JsonAsset;
            LevelManager.loadLevel(asset);
        }
    }

    /**
     * it handles loading of the level/project
     * @param {JsonAsset} asset
     */
    private static loadLevel(asset: JsonAsset): void {
        const levelData = asset.data;
        let levelID: number;
        if (levelData.id === undefined) {
            throw new Error(`Project File exception: project id not found`);
        } else {
            levelID = Number(levelData.id);
        }

        let levelName: string;
        if (levelData.name === undefined) {
            throw new Error(`Project File exception: project name not found`);
        } else {
            levelName = String(levelData.name);
        }

        let levelDescription: string;
        if (levelData.name !== undefined) {
            levelDescription = String(levelData.description);
        }

        LevelManager._activeZone = new Level(levelID, levelName, levelDescription);
        LevelManager._activeZone.initialize(levelData);
        LevelManager._activeZone.onActivated();
        LevelManager._activeZone.load();
    }
}
