import { Shaders } from '../GL/Shaders';
import { Sprite } from '../Graphics/Sprite';
import { BaseComponent } from './BaseComponent';
import { IComponent } from './intefaces/IComponent';
import { IComponentBuilder } from './intefaces/IComponentBuilder';
import { IComponentData } from './intefaces/IComponentData';

export class SpriteComponentData implements IComponentData {
    public name: string;
    public materialName: string;

    public setFromJson(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.materialName !== undefined) {
            this.materialName = String(json.materialName);
        }
    }
}

export class SpriteComponentBuilder implements IComponentBuilder {
    public get type(): string {
        return 'sprite';
    }

    public buildFromJson(json: any): IComponent {
        const data = new SpriteComponentData();
        data.setFromJson(json);
        return new SpriteComponent(data);
    }
}

export class SpriteComponent extends BaseComponent {
    private _sprite: Sprite;

    public constructor(data: SpriteComponentData) {
        super(data);

        this._sprite = new Sprite(data.name, data.materialName);
    }

    public load(): void {
        this._sprite.load();
    }

    public render(shader: Shaders): void {
        this._sprite.draw(shader, this.owner.worldMatrix);

        super.render(shader);
    }
}
