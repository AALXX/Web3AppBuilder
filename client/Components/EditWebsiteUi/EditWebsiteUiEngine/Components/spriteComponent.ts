import { Shaders } from '../GL/Shaders';
import { Sprite } from '../Graphics/Sprite';
import { BaseComponent } from './BaseComponent';
import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';
import { IComponentData } from './interfaces/IComponentData';

/**
 * Sprite Component Dtaa class
 */
export class SpriteComponentData implements IComponentData {
    public name: string;
    public materialName: string;

    /**
     * Set this data from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.materialName !== undefined) {
            this.materialName = String(json.materialName);
        }
    }
}

/**
 * Sprite Component Builder class
 */
export class SpriteComponentBuilder implements IComponentBuilder {
    /**
     * component type
     */
    public get type(): string {
        return 'sprite';
    }

    /**
     * build form json file data
     * @param {any} json
     * @return {IComponent}
     */
    public buildFromJson(json: any): IComponent {
        const data = new SpriteComponentData();
        data.setFromJson(json);
        return new SpriteComponent(data);
    }
}

/**
 * Sprite Component class
 */
export class SpriteComponent extends BaseComponent {
    private _sprite: Sprite;

    /**
     * constructor class
     * @param {SpriteComponentData} data
     */
    public constructor(data: SpriteComponentData) {
        super(data);

        this._sprite = new Sprite(data.name, data.materialName);
    }

    /**
     * load method
     */
    public load(): void {
        this._sprite.load();
    }

    /**
     * REnder method
     * @param {Shaders} shader
     */
    public render(shader: Shaders): void {
        this._sprite.draw(shader, this.owner.worldMatrix);

        super.render(shader);
    }
}
