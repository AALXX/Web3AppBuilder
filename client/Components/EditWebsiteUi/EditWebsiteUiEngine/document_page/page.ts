import { IComponentData } from '../Components/interfaces/IComponentData';
import { Sprite } from '../Graphics/Sprite';
import { Vector3 } from '../Math/Vector3';
import { RenderView } from '../Renderer/RenderView';
import { BasePage } from './BasePage';
import { IPage } from './interfaces/IPage';
import { IPageBuilder } from './interfaces/IPageBuilder';

/**
 * Sprite Component Dtaa class
 */
export class PageData implements IComponentData {
    public name: string;
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
export class PageComponentBuilder implements IPageBuilder {
    /**
     * component type
     */
    public get type(): string {
        return 'page';
    }

    /**
     * build form json file data
     * @param {any} json
     * @return {IComponent}
     */
    public buildFromJson(json: any): IPage {
        const data = new PageData();
        data.setFromJson(json);
        return new PageComponent(data);
    }
}

/**
 * Sprite Component class
 */
export class PageComponent extends BasePage {
    private _sprite: Sprite;
    private _width: number;
    private _height: number;

    /**
     * constructor class
     * @param {PageData} data
     */
    public constructor(data: PageData) {
        super(data);
        this._width = data.width / 1.5;
        this._height = data.height / 1.5;

        this._sprite = new Sprite(data.name, data.materialName, this._width, this._height);

        this._sprite.origin.copyFrom(data.origin);
    }

    /**
     * update method
     * @param {number} time
     */
    public update(time: number): void {}

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
        this._sprite.draw(this.page.worldMatrix, renderView.viewMatrix, renderView.projectionMatrix);
        super.render(renderView);
    }
}
