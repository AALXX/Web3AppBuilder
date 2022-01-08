import { AssetManager } from './AssetsManager';
import { IAsset } from './interfaces/IAsset';
import { IAssetLoader } from './interfaces/IAssetloader';

/**
 * Image Asset
 */
export class ImageAsset implements IAsset {
    public readonly name: string;
    public readonly data: HTMLImageElement;

    /**
     * Class Constructor
     * @param {string} name
     * @param {HTMLElement} data
     */
    constructor(name: string, data: HTMLImageElement) {
        this.name = name;
        this.data = data;
    }

    /**
     * Get Image asset  Width
     */
    public get width(): number {
        return this.data.width;
    }

    /**
     * Get Image asset  heigh
     */
    public get height(): number {
        return this.data.height;
    }
}

/**
 * ImageAssetLoader class
 */
export class ImageAssetLoader implements IAssetLoader {
    /**
     * Suported image xrensions
     */
    public get supportedExtensions(): string[] {
        return ['png', 'gif', 'jpg'];
    }

    /**
     *  Loads the asset
     * @param {string} assetName
     */
    public loadAsset(assetName: string): void {
        const image: HTMLImageElement = new Image();
        image.onload = this.onImageLoaded.bind(this, assetName, image);
        image.src = assetName;
    }

    /**
     * When Image is Loaded
     * @param {string} assetName
     * @param {HTMLImageElement} image
     */
    public onImageLoaded(assetName: string, image: HTMLImageElement): void {
        console.log('onImageLoaded: assetName/image', assetName, image);
        const asset = new ImageAsset(assetName, image);
        AssetManager.onAssetLoaded(asset);
    }
}
