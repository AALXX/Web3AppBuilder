import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../AssetsManager/AssetsManager';
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
    // private static _zones: { [id: number]: Zone } = {};
    private static _registeredZones: { [id: number]: string } = {};
    private static _activeZone: Level;
    private static _inst: LevelManager;

    private constructor() {}

    public static initialize(): void {
        LevelManager._inst = new LevelManager();

        // TEMPORARY
        LevelManager._registeredZones[0] = `${process.env.PROJECTFILES_SERVER}/kw8rybzkj4ova9uyj1/TestProject.json`;
    }

    public static changeLevel(id: number): void {
        if (LevelManager._activeZone !== undefined) {
            LevelManager._activeZone.onDeactivated();
            LevelManager._activeZone.unload();
            LevelManager._activeZone = undefined;
        }

        if (LevelManager._registeredZones[id] !== undefined) {
            if (AssetManager.isAssetLoaded(LevelManager._registeredZones[id])) {
                const asset = AssetManager.getAsset(LevelManager._registeredZones[id]);
                LevelManager.loadLevel(asset);
            } else {
                Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + LevelManager._registeredZones[id], LevelManager._inst);
                AssetManager.loadAsset(LevelManager._registeredZones[id]);
            }
        } else {
            throw new Error('Zone id:' + id.toString() + ' does not exist.');
        }
    }

    public static update(time: number): void {
        if (LevelManager._activeZone !== undefined) {
            LevelManager._activeZone.update(time);
        }
    }

    public static render(shader: Shaders): void {
        if (LevelManager._activeZone !== undefined) {
            LevelManager._activeZone.render(shader);
        }
    }

    public onMessage(message: Message): void {
        if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) !== -1) {
            const asset = message.context as JsonAsset;
            LevelManager.loadLevel(asset);
        }
    }

    private static loadLevel(asset: JsonAsset): void {
        const zoneData = asset.data;
        let zoneId: number;
        if (zoneData.id === undefined) {
            throw new Error('Zone file format exception: Zone id not present.');
        } else {
            zoneId = Number(zoneData.id);
        }

        let zoneName: string;
        if (zoneData.name === undefined) {
            throw new Error('Zone file format exception: Zone name not present.');
        } else {
            zoneName = String(zoneData.name);
        }

        let zoneDescription: string;
        if (zoneData.description !== undefined) {
            zoneDescription = String(zoneData.description);
        }

        LevelManager._activeZone = new Level(zoneId, zoneName, zoneDescription);
        LevelManager._activeZone.initialize(zoneData);
        LevelManager._activeZone.onActivated();
        LevelManager._activeZone.load();
    }
}
