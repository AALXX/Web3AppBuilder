import { RenderView } from './Renderer/RenderView';
/**
 * An interface which represents an object that holds edito-specific information.
 * Used for loading the first/initial level
 */
export interface IEditor {
    /**
     * on engine start
     */
    start(): void;

    /**
     * Called before the main update loop, after updateReady has been called on the engine subsystems.
     * Used for loading the first/initial level, etc.
     */
    updateReady(): void;

    /**
     * Performs update procedures on this edito. Called after all engine subsystems have updated.
     * @param time The delta time in milliseconds since the last update.
     */
    update(time: number): void;

    /**
     * Renders this edito. Called after all engine subsystems have rendered.
     * @param time The delta time in milliseconds since the last frame.
     * @param renderView The view of information used for this render pass.
     */
    render(time: number, renderView: RenderView): void;
}
