import { RefObject } from 'react';
import { gl, GlUtilities } from './GL/GLUtilities';
import { Shaders } from './GL/Shaders';

export namespace UiDesignEngine {
    /**
     ** Engine Class
     */
    export class Engine {
        private _canvas: RefObject<HTMLCanvasElement>;

        private _shader: Shaders; //* temp solution for developing the engine

        /**
         ** Class Constructor
         */
        public constructor() {

        }

        /**
         * Start Method
         * @param {RefObject<HTMLCanvasElement>} canvasRef
         */
        public start(canvasRef: RefObject<HTMLCanvasElement>): void {
            this._canvas = canvasRef;

            this.resize();

            GlUtilities.initialize(this._canvas);

            gl.clearColor(0, 0, 0, 1);

            this.loadShaders();
            this._shader.useShader();
            this.update();
        }

        /**
         * Update Method
         */
        public update(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.update.bind(this));
        }

        /**
         * Resize Method
         */
        public resize(): void {
            this._canvas.current.width = window.innerWidth;
            this._canvas.current.height = window.innerHeight - 60;
        }

        /**
         * It loads The Shaders
         */
        private loadShaders(): void {
            const VertexShaderSource:string = `
                attribute vec3 a_position;
                void main() {
                    gl_Position = vec4(a_position, 1.0);
                }`;

            const FragmentShaderSource:string = `
                void main(){
                    gl_FragColor = vec4(1.0);
                }`;

            this._shader = new Shaders('basic', VertexShaderSource, FragmentShaderSource);
        }
    }
}
