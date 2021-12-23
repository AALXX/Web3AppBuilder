import { Shaders } from '../GL/Shaders';
import { Level } from './Level';
import { TestLevel } from './TestLevel';

/**
 * Level Manager
 */
export class LevelManager {
    private static _globalZoneID: number = -1;
    private static _levels: { [id: number]: Level } = {};
    private static _activeZone: Level;


    /** Class constructor */
    private constructor() {
    }

    /**
     * Create level
     * @param {string} name
     * @param {string} description
     * @return {number}
     */
    public static createLevel(name: string, description: string): number {
        LevelManager._globalZoneID++;
        const level = new Level(LevelManager._globalZoneID, name, description);
        LevelManager._levels[LevelManager._globalZoneID] = level;
        return LevelManager._globalZoneID;
    }

    // TODO: This is temporary code until file loading is supported.
    /**
     * Creaet test zone
     * @return {number}
     */
    public static createTestLevel(): number {
        LevelManager._globalZoneID++;
        const level = new TestLevel(LevelManager._globalZoneID, 'test', 'A simple test zone');
        LevelManager._levels[LevelManager._globalZoneID] = level;
        return LevelManager._globalZoneID;
    }

    /**
     * ChangeLevel
     * @param {number} id
     */
    public static changeLevel(id: number): void {
        if (LevelManager._activeZone !== undefined) {
            LevelManager._activeZone.onDeactivated();
            LevelManager._activeZone.unload();
        }

        if (LevelManager._levels[id] !== undefined) {
            LevelManager._activeZone = LevelManager._levels[id];
            LevelManager._activeZone.onActivated();
            LevelManager._activeZone.load();
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
}
