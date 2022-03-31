import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../../AssetsManager/AssetsManager';
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
    private _handle: WebGLTexture;
    private _isLoaded: boolean = false;
    private _width: number;
    private _height: number;

    /**
     * class constructor
     * @param {string} name
     * @param {number} width
     * @param {number} height
     */
    public constructor(name: string, width: number = 1, height: number = 1) {
        this._name = name;
        this._width = width;
        this._height = height;

        this._handle = gl.createTexture();

        this.bind();

        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);

        const asset = AssetManager.getAsset(this.name) as ImageAsset;
        if (asset !== undefined) {
            this.loadTextureFromAsset(asset);
        } else {
            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this);
        }
    }

    /**
     * get name method
     */
    public get name(): string {
        return this._name;
    }

    /**
     * chack if texture is loladed
     */
    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    /**
     * get texture width
     */
    public get width(): number {
        return this._width;
    }

    /**
     * get texture height
     */
    public get height(): number {
        return this._height;
    }

    /**
     * destroy texture
     */
    public destroy(): void {
        if (this._handle) {
            gl.deleteTexture(this._handle);
        }
    }

    /**
     * activate bind
     * @param {number} textureUnit
     */
    public activateAndBind(textureUnit: number = 0): void {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);

        this.bind();
    }

    /**
     * bind texture
     */
    public bind(): void {
        gl.bindTexture(gl.TEXTURE_2D, this._handle);
    }

    /**
     * Unbind texture
     */
    public unbind(): void {
        gl.bindTexture(gl.TEXTURE_2D, undefined);
    }

    /**
     * On message recived event
     * @param {Message} message
     */
    public onMessage(message: Message): void {
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name) {
            this.loadTextureFromAsset(message.context as ImageAsset);
        }
    }

    /**
     * Loat texure from asset
     * @param {ImageAsset} asset
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
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        this._isLoaded = true;
    }

    /**
     * check if is power of 2
     * @return {boolean}
     */
    private isPowerof2(): boolean {
        return this.isValuePowerOf2(this._width) && this.isValuePowerOf2(this.height);
    }

    /**
     * check if value is power of 2
     * @param {null} value
     * @return {boolean}
     */
    private isValuePowerOf2(value: number): boolean {
        return (value & (value - 1)) == 0;
    }
}
