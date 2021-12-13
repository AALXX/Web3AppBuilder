import { RefObject } from 'react';
import { gl, GlUtilities } from './GL/GLUtilities';
import { Shaders } from './GL/Shaders';
import { Sprite } from './Graphics/Sprite';
import { Matrix4x4 } from './Math/Matrix4x4';
export namespace UiDesignEngine {
    /**
     ** Engine Class
     */
    export class Engine {
        private _canvas: RefObject<HTMLCanvasElement>;

        private _shader: Shaders;
        private _projection: Matrix4x4;

        private _sprite: Sprite;

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

            GlUtilities.initialize(this._canvas);

            gl.clearColor(0, 0.5, 1, 1);

            this.loadShaders();
            this._shader.useShader();

            //* Load
            this._projection = Matrix4x4.orthographic(0, this._canvas.current.width, 0, this._canvas.current.height, -100.0, 100.0);

            this._sprite = new Sprite('test');
            this._sprite.load();
            this._sprite.position.x = 20;
            this._sprite.position.y = 20;

            this.resize();
            this.update();
        }

        /**
         * Update Method
         */
        public update(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            //* Set Uniforms
            const ColorPosition = this._shader.getUniformLocation('uniform_color');
            gl.uniform4f(ColorPosition, 0, 1, 0, 1);

            const projectionPosition = this._shader.getUniformLocation('u_projection');
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            const ModelLocation = this._shader.getUniformLocation('u_model');
            gl.uniformMatrix4fv(ModelLocation, false, new Float32Array(Matrix4x4.translation(this._sprite.position).data));


            this._sprite.draw();

            //* Call this instance update
            requestAnimationFrame(this.update.bind(this));
        }

        /**
         * Resize Method
         */
        public resize(): void {
            this._canvas.current.width = window.innerWidth;
            this._canvas.current.height = window.innerHeight - 60;
            // gl.viewport(-1, 1, this._canvas.current.width, this._canvas.current.height);
        }

        /**
         * It loads The Shaders
         */
        private loadShaders(): void {
            const VertexShaderSource: string = `
            attribute vec3 a_position;
            uniform mat4 u_projection;
            uniform mat4 u_model;
            void main() {
                gl_Position = vec4(a_position, 1.0);
                gl_Position = u_projection * u_model * vec4(a_position, 1.0);
            }`;

            const FragmentShaderSource: string = `
            precision mediump float;
            uniform vec4 uniform_color;
            void main(){
                gl_FragColor = uniform_color;
            }`;

            this._shader = new Shaders('basic', VertexShaderSource, FragmentShaderSource);
        }
    }
}
