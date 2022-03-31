import { RefObject } from 'react';
import { gl } from '../GL/GLUtilities';
import { IEditor } from '../IEditor';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { LevelManager } from '../world/LevelManager';
import { RendererViewport, RendererViewportCreateInfo } from './RendererViewport';
import { RenderView } from './RenderView';

/**
 * Responsible for handling rendering jobs within the engine.
 */
export class Renderer {
    private _windowViewport: RendererViewport;
    private _defaultView: Matrix4x4;
    private _renderView: RenderView;

    /**
     * Creates a new Renderer.
     * @param {RendererViewportCreateInfo} createInfo The creation info used to create this renderer.
     * @param {RefObject<HTMLCanvasElement>} canvasRef canvas
     */
    public constructor(createInfo: RendererViewportCreateInfo, canvasRef: RefObject<HTMLCanvasElement>) {
        this._windowViewport = new RendererViewport(createInfo, canvasRef);
        this._defaultView = Matrix4x4.identity();
        this._renderView = new RenderView();
    }

    /** Returns the canvas used by the viewport. */
    public get windowViewportCanvas(): RefObject<HTMLCanvasElement> {
        return this._windowViewport.canvas;
    }

    /** Called when the viewport is resized.
     * @param {numver} width
     * @param {numver} height
     */
    public onResize(width: number, height: number): void {
        if (this._windowViewport) {
            this._windowViewport.onResize(width, height);
        }
    }

    /**
     * Begins the render process.
     * @param {number} time The time in milliseconds since the last frame.
     * @param {IEditor} editor The editor to be rendered.
     */
    public beginRender(time: number, editor: IEditor): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Update the render view for the world pass.
        this._renderView.deltaTime = time;
        this._renderView.flipProjection = false;
        this._renderView.fov = this._windowViewport.fov;
        this._renderView.projectionMatrix = this._windowViewport.getProjectionMatrix();
        this._renderView.shortenZNear = false;
        this._renderView.globalMaterial = undefined; // NOTE: Additional render passes could specify a different material here.

        // Render the world.
        this.renderWorld();

        editor.render(time, this._renderView);
    }

    /**
     * Ends the render process.
     */
    public endRender(): void {
        // TODO: swap buffer here
    }

    /**
     * render world
     */
    private renderWorld(): void {
        // If there is an active level loaded, generate a render view and pass it through.
        if (LevelManager.isLoaded && LevelManager.activeLevel !== undefined) {
            let view: Matrix4x4;
            if (LevelManager.activeLevel.activeCamera !== undefined) {
                view = LevelManager.activeLevel.activeCamera.view;
            } else {
                view = this._defaultView;
            }

            // Update view matrix.
            this._renderView.viewMatrix = view;

            LevelManager.activeLevel.render(this._renderView);
        }
    }
}
