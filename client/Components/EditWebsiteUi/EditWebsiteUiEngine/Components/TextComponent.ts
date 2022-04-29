import { BitmapText } from '../Graphics/Text/BitmapText';
import { Vector3 } from '../Math/Vector3';
import { Message } from '../MessageManager/Message';
import { RenderView } from '../Renderer/RenderView';
import { BaseComponent } from './BaseComponent';
import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';
import { IComponentData } from './interfaces/IComponentData';

/**
 * Text Component Dtaa class
 */
export class TextComponentData implements IComponentData {
    public name: string;
    public fontName: string;
    public origin: Vector3 = Vector3.zero;
    public textContent: string;
    public type: string;

    /**
     * sed data from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.type !== undefined) {
            this.type = String(json.type);
        }

        if (json.fontName !== undefined) {
            this.fontName = String(json.fontName);
        }

        if (json.textContent !== undefined) {
            this.textContent = String(json.textContent);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJson(json.origin);
        }
    }
}

/**
 * Text Component Builder class
 */
export class TextComponentBuilder implements IComponentBuilder {
    /**
     * get type
     */
    public get type(): string {
        return 'text';
    }

    /**
     * Build from Json
     * @param {any} json
     * @return {IComponent}
     */
    public buildFromJson(json: any): IComponent {
        const data = new TextComponentData();
        data.setFromJson(json);
        return new TextComponent(data);
    }
}

/**
 * Sprite Component class
 */
export class TextComponent extends BaseComponent {
    private _bitmapText: BitmapText;
    private _fontName: string;

    /**
     * constructor class
     * @param {TextComponent} data
     */
    public constructor(data: TextComponentData) {
        super(data);
        this._fontName = data.fontName;
        this._bitmapText = new BitmapText(this.name, this._fontName);
        if (!data.origin.equals(Vector3.zero)) {
            this._bitmapText.origin.copyFrom(data.origin);
        }

        this._bitmapText.text = 'test';

        // Listen for text updates.
        Message.subscribe(this.name + ':SetText', this);
    }

    /** Loads this component. */
    public load(): void {
        this._bitmapText.load();
    }

    /**
     * Updates this component.
     * @param {number} time The amount of time in milliseconds since the last update.
     */
    public update(time: number): void {
        this._bitmapText.update(time);
    }

    /**
     * Renders this component.
     * @param {RenderView} renderView The shader to use for rendering.
     */
    public render(renderView: RenderView): void {
        this._bitmapText.draw(this.owner.worldMatrix, renderView.viewMatrix, renderView.projectionMatrix);
        super.render(renderView);
    }

    /**
     * The message handler.
     * @param {Message} message The message to be handled.
     */
    public onMessage(message: Message): void {
        if (message.code === this.name + ':SetText') {
            this._bitmapText.text = String(message.context);
        }
    }
}
