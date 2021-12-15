import { RefObject } from 'react';
import { AssetsManager } from './AssetsManager/AssetsManager';
import { gl, GlUtilities } from './GL/GLUtilities';
import { Shaders } from './GL/Shaders';
import { Sprite } from './Graphics/Sprite';
import { Matrix4x4 } from './Math/Matrix4x4';
import { MessageBus } from './MessageManager/MessageBus';
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
            AssetsManager.initialize();

            gl.clearColor(0, 0, 0, 1);

            this.loadShaders();
            this._shader.useShader();

            //* Load
            this._projection = Matrix4x4.orthographic(0, this._canvas.current.width, this._canvas.current.height, 0, -100.0, 100.0);

            this._sprite = new Sprite('test', './assets/texure.jpg', 100, 100);
            this._sprite.load();
            this._sprite.position.x = 1000;
            this._sprite.position.y = 100;

            this.resize();
            this.update();
        }

        /**
         * Update Method
         */
        public update(): void {
            MessageBus.update(0);


            gl.clear(gl.COLOR_BUFFER_BIT);

            //* Set Uniforms
            const ColorPosition = this._shader.getUniformLocation('u_tint');
            // gl.uniform4f(ColorPosition, 1, 0.5, 0, 1);
            gl.uniform4f(ColorPosition, 1, 1, 1, 1);


            const projectionPosition = this._shader.getUniformLocation('u_projection');
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            const ModelLocation = this._shader.getUniformLocation('u_model');
            gl.uniformMatrix4fv(ModelLocation, false, new Float32Array(Matrix4x4.translation(this._sprite.position).data));


            this._sprite.draw(this._shader);

            //* Call this instance update
            requestAnimationFrame(this.update.bind(this));
        }

        /**
         * Resize Method
         */
        public resize(): void {
            this._canvas.current.width = window.innerWidth;
            this._canvas.current.height = window.innerHeight - 15;
            gl.viewport(0, 0, this._canvas.current.width, this._canvas.current.height);
            this._projection = Matrix4x4.orthographic(0, this._canvas.current.width, this._canvas.current.height, 0, -100.0, 100.0);
        }

        /**
         * It loads The Shaders
         */
        private loadShaders(): void {
            const vertexShaderSource = `
            attribute vec3 a_position;
            attribute vec2 a_texCoord;
            uniform mat4 u_projection;
            uniform mat4 u_model;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = u_projection * u_model * vec4(a_position, 1.0);
                v_texCoord = a_texCoord;
            }`;

            const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 u_tint;
            uniform sampler2D u_diffuse;
            varying vec2 v_texCoord;
            void main() {
                gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
            }
            `;

            this._shader = new Shaders('basic', vertexShaderSource, fragmentShaderSource);
        }
    }
}
