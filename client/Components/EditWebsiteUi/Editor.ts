import { IEditor } from './EditWebsiteUiEngine/IEditor';
import { RenderView } from './EditWebsiteUiEngine/Renderer/RenderView';
import { LevelManager } from './EditWebsiteUiEngine/world/LevelManager';

/**
 * Represents an object that holds game-specific information.
 */
export class Editor implements IEditor {
    /**
     * Called before the main update loop, after updateReady has been called on the engine subsystems.
     * Used for loading the first/initial level, etc.
     */
    public updateReady(): void {
        // Load the test level. This should be configurable.
        LevelManager.changeLevel('test 1');
    }

    /**
     * Performs update procedures on this game. Called after all engine subsystems have updated.
     * @param {number} time The delta time in milliseconds since the last update.
     */
    public update(time: number): void {}

    /**
     * Renders this game. Called after all engine subsystems have rendered.
     * @param {number} time The delta time in milliseconds since the last frame.
     * @param {RenderView} renderView The view of information used for this render pass.
     */
    public render(time: number, renderView: RenderView): void {}
}
