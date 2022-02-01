import { RefObject } from 'react';
import { gl, GlUtilities } from '../GL/GLUtilities';
import { Matrix4x4 } from '../Math/Matrix4x4';

/* eslint-disable */

/** Indicates the type of projection used by a viewport. */
export enum ViewportProjectionType {
    /** Orthographic projection. Useful for 2D games. */
    ORTHOGRAPHIC,

    /** Perspective projection. Useful for 3D games. */
    PERSPECTIVE,
}

/** Indicates the viewport size mode. */
export enum ViewportSizeMode {
    /** The viewport is a fixed size and maintains an aspect ratio upon window resize. */
    FIXED,

    /** The viewport is a dynamic size and does NOT maintain an aspect ratio upon window resize. */
    DYNAMIC,
}
/* eslint-enable */

/**
 * RendererViewportCreateInfo class
 */
export class RendererViewportCreateInfo {
    /** The x-position of the viewport. */
    public x?: number;

    /** The y-position of the viewport. */
    public y?: number;

    /** The width of this viewport. Optional. Only declare this for a fixed viewport size. */
    public width?: number;

    /** The height of this viewport. Optional. Only declare this for a fixed viewport size. */
    public height?: number;

    /** The field of view in radians. Only used by ViewportProjectionType.PERSPECTIVE. */
    public fov?: number;

    /** The distance to the near clipping plane. */
    public nearClip: number;

    /** The distance to the far clipping plane. */
    public farClip: number;

    /** The type of projection used by this viewport. */
    public projectionType: ViewportProjectionType;

    /** The element id of the HTMLCanvasElement to use. If undefined, one will be created dynamically. */
    public elementId?: string;
}

/**
 * Represents a viewport used by a renderer. Responsible for maintaining aspect ratio and
 * projection matrices.
 */
export class RendererViewport {
    private _isDirty: boolean = true;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _fov: number;
    private _nearClip: number;
    private _farClip: number;
    private _projectionType: ViewportProjectionType;
    private _projection: Matrix4x4;
    private _sizeMode: ViewportSizeMode = ViewportSizeMode.DYNAMIC;

    private _canvas: RefObject<HTMLCanvasElement>;

    /**
     * Creates a new RendererViewport.
     * @param {RendererViewportCreateInfo} createInfo The viewport creation info.
     * @param {RefObject<HTMLCanvasElement>} canvasRef canvas ref
     */
    public constructor(createInfo: RendererViewportCreateInfo, canvasRef: RefObject<HTMLCanvasElement>) {
        this._width = createInfo.width;
        this._height = createInfo.height;
        this._x = createInfo.x;
        this._y = createInfo.y;
        this._nearClip = createInfo.nearClip;
        this._farClip = createInfo.farClip;
        this._fov = createInfo.fov;
        this._projectionType = createInfo.projectionType;

        if (this._width !== undefined && this._height !== undefined) {
            // this._aspect = this._width / this._height;
            this._sizeMode = ViewportSizeMode.FIXED;
        }

        this._canvas = canvasRef;
        GlUtilities.initialize(this._canvas);

        // GL init
        // gl.clearColor( 146 / 255, 206 / 255, 247 / 255, 1 );
        console.log(gl);
        gl.clearColor(0.5, 0.5, 0.5, 1);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Matrix4x4.orthographic( 0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0 )
    }

    /** The canvas this viewport is rendered to. */
    public get canvas(): RefObject<HTMLCanvasElement> {
        return this._canvas;
    }

    /** The width of this viewport. */
    public get width(): number {
        return this._width;
    }

    /** The height of this viewport. */
    public get height(): number {
        return this._height;
    }

    /** The field of view in radians. Only used by ViewportProjectionType.PERSPECTIVE. */
    public get fov(): number {
        return this._fov;
    }

    /** The field of view in radians. Only used by ViewportProjectionType.PERSPECTIVE.
     * @param {number} value
     */
    public set fov(value: number) {
        this._fov = value;
        this._isDirty = true;
    }

    /** The x-position of the viewport. */
    public get x(): number {
        return this._x;
    }

    /** The y-position of the viewport. */
    public get y(): number {
        return this._y;
    }

    /** The distance to the near clipping plane. */
    public get nearClip(): number {
        return this._nearClip;
    }

    /** The distance to the near clipping plane.
     * @param {number} value
     */
    public set nearClip(value: number) {
        this._nearClip = value;
        this._isDirty = true;
    }

    /** The distance to the far clipping plane. */
    public get farClip(): number {
        return this._farClip;
    }

    /** The distance to the far clipping plane.
     * @param {number} value
     */
    public set farClip(value: number) {
        this._farClip = value;
        this._isDirty = true;
    }

    /** The type of projection used by this viewport. */
    public get projectionType(): ViewportProjectionType {
        return this._projectionType;
    }

    /** The type of projection used by this viewport.
     * @param {ViewportProjectionType} value
     */
    public set projectionType(value: ViewportProjectionType) {
        this._projectionType = value;
        this._isDirty = true;
    }

    /** Returns the appropriate projection matrix for this viewport.
     * @return {Matrix4x4}
     */
    public getProjectionMatrix(): Matrix4x4 {
        if (this._isDirty || this._projection === undefined) {
            this.regenerateMatrix();
        }
        return this._projection;
    }

    /**
     * Called when this viewport should be resized.
     * @param {number} width The new width of this viewport.
     * @param {number} height The new height of this viewport.
     */
    public onResize(width: number, height: number): void {
        this._width = width;
        this._height = height;
        this._isDirty = true;

        if (this._canvas !== undefined) {
            // Adjust the viewport to fill the screen.
            this._canvas.current.width = window.innerWidth;
            this._canvas.current.height = window.innerHeight;
            this._width = window.innerWidth;
            this._height = window.innerHeight;
            gl.viewport(this._x, this._y, this._width, this._height);
            // this._projection = Matrix4x4.orthographic( this.x, window.innerWidth, window.innerHeight, this.y, -100.0, 100.0 );
        }
    }

    /**
     * Called when this viewport should be repositioned.
     * @param {number} x The new x-position of this viewport.
     * @param {number} y The new y-position of this viewport.
     */
    public Reposition(x: number, y: number): void {
        this._x = x;
        this._y = y;
        this._isDirty = true;
    }

    /**
     * regenerate Matrix
     */
    private regenerateMatrix(): void {
        if (this._projectionType === ViewportProjectionType.ORTHOGRAPHIC) {
            this._projection = Matrix4x4.orthographic(this._x, this._width, this._height, this._y, this._nearClip, this._farClip);
        } else {
            console.log('Not Supported');
            // this._projection = Matrix4x4.perspective(this._fov, this._width / this._height, this._nearClip, this._farClip);
        }
        this._isDirty = false;
    }
}
