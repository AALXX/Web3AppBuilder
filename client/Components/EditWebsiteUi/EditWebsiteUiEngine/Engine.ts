import { RefObject } from 'react';
import { AssetManager } from './AssetsManager/AssetsManager';
import { BehaviorManager } from './Behaviors/BehaviorManager';
import { KeyboardMovementBehaviorBuilder } from './Behaviors/keyboardMovementBehavior';
import { MoveComponentBehaviorBuilder } from './Behaviors/MoveComponentBehavior';
import { CollisionManager } from './collision/collisionManager';
import { CollisionComponentBuilder } from './Components/collisionComponent';
import { ComponentManager } from './Components/ComponentsManager';
import { SpriteComponentBuilder } from './Components/spriteComponent';
import { gl } from './GL/GLUtilities';
// import { CollisionComponentBuilder } from './Components/collisionComponent';
import { MaterialManager } from './Graphics/Material/MaterialManager';
import { ShaderManager } from './Graphics/ShaderManager';
import { IEditor } from './IEditor';
import { InputManager } from './Input/InputManager';
import { IMessageHandler } from './MessageManager/IMessageHandler';
import { Message } from './MessageManager/Message';
import { MessageBus } from './MessageManager/MessageBus';
import { Renderer } from './Renderer/Renderer';
import { RendererViewportCreateInfo, ViewportProjectionType } from './Renderer/RendererViewport';
import { LevelManager } from './world/LevelManager';
export namespace UiDesignEngine {
    /**
     ** Engine Class
     */
    export class Engine implements IMessageHandler {
        private _previousTime: number = 0;
        private _editorWidth: number;
        private _editorHeight: number;

        private _isFirstUpdate: boolean = true;

        private _renderer: Renderer;
        private _editor: IEditor;
        /**
         * Class Constructor
         * @param {number} width
         * @param {number} height
         */
        public constructor(width?: number, height?: number) {
            this._editorWidth = width;
            this._editorHeight = height;
        }

        /**
         * Resize Method
         */
        public resize(): void {
            if (this._renderer) {
                this._renderer.onResize();
            }
        }

        /**
         * Start Method
         * @param {IEditor} editor
         * @param {RefObject<HTMLCanvasElement>} canvasRef
         * @param {string} elementName
         */
        public start(editor: IEditor, canvasRef: RefObject<HTMLCanvasElement>, elementName?: string): void {
            this._editor = editor;

            const rendererViewportCreateInfo: RendererViewportCreateInfo = new RendererViewportCreateInfo();
            rendererViewportCreateInfo.elementId = elementName;
            rendererViewportCreateInfo.projectionType = ViewportProjectionType.ORTHOGRAPHIC;
            rendererViewportCreateInfo.width = this._editorWidth;
            rendererViewportCreateInfo.height = this._editorHeight;
            rendererViewportCreateInfo.nearClip = 0.1;
            rendererViewportCreateInfo.farClip = 1000.0;
            rendererViewportCreateInfo.x = 0;
            rendererViewportCreateInfo.y = 0;

            this._renderer = new Renderer(rendererViewportCreateInfo, canvasRef);

            console.log(`GL_VERSION:               ${gl.getParameter(gl.VERSION)}`);
            console.log(`GL_VENDOR:                ${gl.getParameter(gl.VENDOR)}`);
            console.log(`GL_RENDERER:              ${gl.getParameter(gl.RENDERER)}`);
            console.log(`SHADING_LANGUAGE_VERSION: ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);

            // Attempt to load additional information.
            const debugRendererExtension = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugRendererExtension !== undefined && debugRendererExtension !== null) {
                console.debug(`UNMASKED_VENDOR_WEBGL:    ${gl.getParameter(debugRendererExtension.UNMASKED_VENDOR_WEBGL)}`);
                console.debug(`UNMASKED_RENDERER_WEBGL:  ${gl.getParameter(debugRendererExtension.UNMASKED_RENDERER_WEBGL)}`);
            }

            // Initialize various sub-systems.
            AssetManager.initialize();
            ShaderManager.initialize();
            InputManager.initialize(this._renderer.windowViewportCanvas);

            // Load fonts
            // BitmapFontManager.load();

            /**
             * component buider
             */
            ComponentManager.registerBuilder(new SpriteComponentBuilder());

            ComponentManager.registerBuilder(new CollisionComponentBuilder());

            /**
             * behavior builder
             */
            BehaviorManager.registerBuilder(new KeyboardMovementBehaviorBuilder());
            BehaviorManager.registerBuilder(new MoveComponentBehaviorBuilder());

            // Load level config
            LevelManager.load();

            // Load material configs
            MaterialManager.load();

            // Trigger a resize to make sure the viewport is corrent.
            this.resize();

            // Begin the preloading phase, which waits for various thing to be loaded before starting the game.
            this.preloading();
        }

        /**
         * before loadeing method
         */
        private preloading(): void {
            // Make sure to always update the message bus.
            MessageBus.update(0);

            // if (!BitmapFontManager.isLoaded) {
            //     requestAnimationFrame(this.preloading.bind(this));
            //     return;
            // }

            if (!MaterialManager.isLoaded) {
                requestAnimationFrame(this.preloading.bind(this));
                return;
            }

            if (!LevelManager.isLoaded) {
                requestAnimationFrame(this.preloading.bind(this));
                return;
            }

            // Perform items such as loading the first/initial level, etc.
            this._editor.updateReady();

            // Kick off the render loop.
            this.loop();
        }

        /**
         * on message recived
         * @param {Message} message
         */
        public onMessage(message: Message): void {}

        /**
         * main game loop
         */
        private loop(): void {
            if (this._isFirstUpdate) {
            }

            const delta = performance.now() - this._previousTime;

            this.update(delta);
            this.render(delta);

            this._previousTime = performance.now();

            requestAnimationFrame(this.loop.bind(this));
        }
        /**
         * Update Method
         * @param {number} delta
         */
        private update(delta: number): void {
            MessageBus.update(delta);
            if (LevelManager.isLoaded && LevelManager.activeLevel !== undefined && LevelManager.activeLevel.isLoaded) {
                LevelManager.activeLevel.update(delta);
            }

            CollisionManager.update(delta);
            this._editor.update(delta);
        }

        /**
         * Render method
         * @param {number} delta
         */
        private render(delta: number): void {
            this._renderer.beginRender(delta, this._editor);

            this._renderer.endRender();
        }
    }
}
