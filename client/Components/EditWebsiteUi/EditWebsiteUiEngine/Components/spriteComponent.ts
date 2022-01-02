import { Shaders } from '../GL/Shaders';
import { Sprite } from '../Graphics/Sprite';
import { BaseComponent } from './BaseComponent';

/**
 * Get Sprite component data from json
 */
export class SpriteComponentData {
    public name: string;
    public materialName: string;

    /**
     * Set from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.materialName !== undefined) {
            this.name = String(json.materialName);
        }
    }
}

/**
 * Sprite Component Builder
 */
export class SpriteComponentBuilder {}

/**
 * Sprite Component
 */
export class SpriteComponent extends BaseComponent {
    private _sprite: Sprite;

    /**
     * Class constructor
     * @param {string} name
     * @param {materialName} materialName
     */
    public constructor(name: string, materialName: string) {
        super(name);

        this._sprite = new Sprite(name, materialName);
    }

    /**
     * Load
     */
    public load(): void {
        this._sprite.load();
    }

    /**
     * REnder
     * @param {Shaders} shader
     */
    public render(shader: Shaders): void {
        this._sprite.draw(shader, this.owner.worldMatrix);

        super.render(shader);
    }
}
