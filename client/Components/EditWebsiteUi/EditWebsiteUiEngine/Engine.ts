import { RefObject } from 'react';
import { AssetManager } from './AssetsManager/AssetsManager';
import { BehaviorManager } from './Behaviors/BehaviorManager';
import { KeyboardMovementBehaviorBuilder } from './Behaviors/keyboardMovementBehavior';
import { CollisionManager } from './collision/collisionManager';
import { CollisionComponentBuilder } from './Components/collisionComponent';
import { ComponentManager } from './Components/ComponentsManager';
import { SpriteComponentBuilder } from './Components/spriteComponent';
import { gl, GlUtilities } from './GL/GLUtilities';
import { BasicShader } from './GL/shaders/basicShader';
import { Color } from './Graphics/Material/Color';
import { Material } from './Graphics/Material/Material';
import { MaterialManager } from './Graphics/Material/MaterialManager';
import { InputManager, MouseContext } from './Input/InputManager';
import { Matrix4x4 } from './Math/Matrix4x4';
import { IMessageHandler } from './MessageManager/IMessageHandler';
import { Message } from './MessageManager/Message';
import { MessageBus } from './MessageManager/MessageBus';
import { LevelManager } from './world/LevelManager';
export namespace UiDesignEngine {
    /**
     ** Engine Class
     */
    export class Engine implements IMessageHandler {
        private _canvas: RefObject<HTMLCanvasElement>;
        private _basicShader: BasicShader;
        private _projection: Matrix4x4;
        private _previousTime: number = 0;

        /**
         ** Class Constructor
         */
        public constructor() {}

        /**
         * Resize Method
         */
        public resize(): void {
            this._canvas.current.width = window.innerWidth;
            this._canvas.current.height = window.innerHeight;
            gl.viewport(0, 0, this._canvas.current.width, this._canvas.current.height);
            this._projection = Matrix4x4.orthographic(0, this._canvas.current.width, this._canvas.current.height, 0, -100.0, 100.0);
        }

        /**
         * Start Method
         * @param {RefObject<HTMLCanvasElement>} canvasRef
         */
        public start(canvasRef: RefObject<HTMLCanvasElement>): void {
            this._canvas = canvasRef;
            GlUtilities.initialize(this._canvas);
            AssetManager.initialize();
            InputManager.initialize();

            LevelManager.initialize();

            //* register component builder
            ComponentManager.registerBuilder(new SpriteComponentBuilder());

            ComponentManager.registerBuilder(new CollisionComponentBuilder());

            BehaviorManager.registerBuilder(new KeyboardMovementBehaviorBuilder());

            //* register Mterials
            MaterialManager.registerMaterial(new Material('wood', '../assets/texure.jpg', new Color(255, 255, 255, 255)));
            MaterialManager.registerMaterial(new Material('carMat', '../assets/car.png', new Color(255, 255, 255, 255)));

            gl.clearColor(0.5, 0.5, 0.5, 1);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this._basicShader = new BasicShader();
            this._basicShader.useShader();

            //* Load
            this._projection = Matrix4x4.orthographic(0, this._canvas.current.width, this._canvas.current.height, 0, -100.0, 100.0);

            // TODO: change to be read from a game config file later
            LevelManager.changeLevel(0);

            this.resize();
            this.loop();
        }

        /**
         * on message recived
         * @param {Message} message
         */
        public onMessage(message: Message): void {
            if (message.code === 'MOUSE_UP') {
                const context = message.context as MouseContext;
                console.log(`Pos: [${context.position.x},${context.position.y}]`);
            }
        }

        /**
         * Loop Method
         */
        public loop(): void {
            this.update();
            this.render();
        }

        /**
         * Update Method
         */
        public update(): void {
            const delta = performance.now() - this._previousTime;

            MessageBus.update(delta);
            LevelManager.update(delta);
            CollisionManager.update(delta);

            this._previousTime = performance.now();
        }

        /**
         * Render method
         */
        public render(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            LevelManager.render(this._basicShader);

            const projectionPosition = this._basicShader.getUniformLocation('u_projection');
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            //* Call this instance update
            requestAnimationFrame(this.loop.bind(this));
        }
    }
}
