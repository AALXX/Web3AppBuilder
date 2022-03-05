import { Sprite } from '../Graphics/Sprite';
import { Vector3 } from '../Math/Vector3';
import { RenderView } from '../Renderer/RenderView';
import { BaseComponent } from './BaseComponent';
import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';
import { IComponentData } from './interfaces/IComponentData';

/**
 * Sprite Component Dtaa class
 */
export class SpriteComponentData implements IComponentData {
    public name: string;
    public type: string;
    public materialName: string;
    public origin: Vector3 = Vector3.zero;
    public width: number;
    public height: number;

    /**
     * Set this data from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.type !== undefined) {
            this.type = String(json.type);
        }

        if (json.width !== undefined) {
            this.width = Number(json.width);
        }

        if (json.height !== undefined) {
            this.height = Number(json.height);
        }

        if (json.materialName !== undefined) {
            this.materialName = String(json.materialName);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJson(json.origin);
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
    private _width: number;
    private _height: number;

    /**
     * constructor class
     * @param {SpriteComponentData} data
     */
    public constructor(data: SpriteComponentData) {
        super(data);
        this._width = data.width;
        this._height = data.height;
        this._sprite = new Sprite(data.name, data.materialName, this._width, this._height);

        if (!data.origin.equals(Vector3.zero)) {
            this._sprite.origin.copyFrom(data.origin);
        }
    }

    /**
     * load method
     */
    public load(): void {
        this._sprite.load();
    }

    /**
     * REnder method
     * @param {RenderView} renderView
     */
    public render(renderView: RenderView): void {
        this._sprite.draw(this.owner.worldMatrix, renderView.viewMatrix, renderView.projectionMatrix);

        super.render(renderView);
    }
}
