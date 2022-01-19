import { RefObject } from 'react';
export let gl: WebGLRenderingContext;
/**
 * Provides all Web Gl Utilites
 */
export class GlUtilities {
    /**
     * Initializator
     * @param {RefObject<HTMLCanvasElement>} canvasRef
     *
     */
    public static initialize(canvasRef: RefObject<HTMLCanvasElement>): void {
        if (canvasRef === null || canvasRef === undefined) {
            throw new Error('no canvas element is null');
        }

        gl = canvasRef.current.getContext('webgl');

        if (gl === undefined || gl === null) {
            throw new Error('unable to initialize WebGL');
        }
    }
}
