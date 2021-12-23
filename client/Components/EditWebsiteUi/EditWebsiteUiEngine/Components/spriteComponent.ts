import { Shaders } from '../GL/Shaders';
import { Sprite } from '../Graphics/Sprite';
import { BaseComponent } from './BaseComponent';

/**
 * Spreite copmponent
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
