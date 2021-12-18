import { RefObject } from 'react';
import { AssetsManager } from './AssetsManager/AssetsManager';
import { gl, GlUtilities } from './GL/GLUtilities';
import { BasicShader } from './GL/shaders/basicShader';
import { Color } from './Graphics/Material/Color';
import { Material } from './Graphics/Material/Material';
import { MaterialManager } from './Graphics/Material/MaterialManager';
import { Sprite } from './Graphics/Sprite';
import { Matrix4x4 } from './Math/Matrix4x4';
import { MessageBus } from './MessageManager/MessageBus';
export namespace UiDesignEngine {
    /**
     ** Engine Class
     */
    export class Engine {
        private _canvas: RefObject<HTMLCanvasElement>;

        private _basicShader: BasicShader;
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

            this._basicShader = new BasicShader();
            this._basicShader.useShader();

            //* Load Mterials
            MaterialManager.registerMaterial(new Material('wood', './assets/texure.jpg', new Color(0, 255, 0, 255)));

            //* Load
            this._projection = Matrix4x4.orthographic(0, this._canvas.current.width, this._canvas.current.height, 0, -100.0, 100.0);

            this._sprite = new Sprite('test', 'wood', 100, 100);
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

            const projectionPosition = this._basicShader.getUniformLocation('u_projection');
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            this._sprite.draw(this._basicShader);

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
    }
}
