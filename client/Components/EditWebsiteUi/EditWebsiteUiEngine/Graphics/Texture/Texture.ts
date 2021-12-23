import { AssetsManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../../AssetsManager/AssetsManager';
import { ImageAsset } from '../../AssetsManager/ImageAssetLoader';
import { gl } from '../../GL/GLUtilities';
import { IMessageHandler } from '../../MessageManager/IMessageHandler';
import { Message } from '../../MessageManager/Message';

const LEVEL: number = 0;
const BORDER: number = 0;
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]); // RGBA data

/**
 * Texture handler class
 */
export class Texture implements IMessageHandler {
    private _name: string;
    private _handler: WebGLTexture;
    private _isLoaded: boolean = false;
    private _width: number;
    private _height: number;

    /**
     * Class constructor
     * @param {string} name
     * @param {number} width
     * @param {number} height
     */
    public constructor(name: string, width: number = 1, height = 1) {
        this._name = name;
        this._width = width;
        this._height = height;

        this._handler = gl.createTexture();

        Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this);

        this.bind();

        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);

        const asset = AssetsManager.getAsset(this.name) as ImageAsset;
        if (asset !== undefined) {
            this.loadTextureFromAsset(asset);
        }
    }

    /**
     * getter for name
     */
    public get name(): string {
        return this._name;
    }

    /**
    * getter for is loaded
    */
    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    /**
    * getter for is width
    */
    public get width(): number {
        return this._width;
    }

    /**
    * getter for is loaded
    */
    public get height(): number {
        return this._height;
    }

    /**
     * Destroy method for clean up the src
    */
    public destroy(): void {
        gl.deleteTexture(this._handler);
    }


    /**
     * Activate the texture
     * @param {number} textureUnit
     */
    public activateAndBind(textureUnit: number = 0): void {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);

        this.bind();
    }

    /**
     * Bind texture
     */
    public bind(): void {
        gl.bindTexture(gl.TEXTURE_2D, this._handler);
    }

    /**
     * UnBind texture
     */
    public unBind(): void {
        gl.bindTexture(gl.TEXTURE_2D, undefined);
    }

    /**
     *On Message Method
     * @param {Message} message
     */
    onMessage(message: Message): void {
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name) {
            this.loadTextureFromAsset(message.context as ImageAsset);
        }
    }

    /**
     * Load Texture From Asset
     * @param { ImageAsset} asset
     */
    private loadTextureFromAsset(asset: ImageAsset): void {
        this._width = asset.width;
        this._height = asset.height;

        this.bind();

        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.data);

        if (this.isPowerof2()) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // Do not generate a mip map and clamp wrapping to edge.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }


        this._isLoaded = true;
    }

    /**
     *
     * @return {boolean}
     */
    private isPowerof2(): boolean {
        return (this.isValuePowerOf2(this._width) && this.isValuePowerOf2(this.height));
    }

    /**
     *
     * @param {nimber} value
     * @return {boolean}
     */
    private isValuePowerOf2(value: number): boolean {
        return (value & (value - 1)) == 0;
    }
}
