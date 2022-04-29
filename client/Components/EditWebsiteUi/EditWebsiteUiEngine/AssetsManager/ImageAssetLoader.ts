import { AssetManager } from './AssetsManager';
import { IAsset } from './interfaces/IAsset';
import { IAssetLoader } from './interfaces/IAssetloader';

/**
 * Image Asset
 */
export class ImageAsset implements IAsset {
    /** The name of this asset. */
    public readonly Name: string;

    /** The data of this asset. */
    public readonly Data: HTMLImageElement;

    /**
     * Class Constructor
     * @param {string} name
     * @param {HTMLElement} data
     */
    public constructor(name: string, data: HTMLImageElement) {
        this.Name = name;
        this.Data = data;
    }
    /** The width of this image asset. */
    public get width(): number {
        return this.Data.width;
    }

    /** The height of this image asset. */
    public get height(): number {
        return this.Data.height;
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
        const extension = assetName.substring(assetName.lastIndexOf('.') + 1, assetName.length) || assetName;

        /* eslint-disable */

        switch (extension.toLowerCase()) {
            default:
                // Normal image loading process.
                const image: HTMLImageElement = new Image();
                image.onload = this.onImageLoaded.bind(this, assetName, image);
                image.src = assetName;
                image.crossOrigin = 'anonymous';
                break;
        }
        /* eslint-enable */
    }

    /**
     * When Image is Loaded
     * @param {string} assetName
     * @param {HTMLImageElement} image
     */
    private onImageLoaded(assetName: string, image: HTMLImageElement): void {
        // console.log( "onImageLoaded: assetName/image", assetName, image );
        console.log('onImageLoaded: assetName/image', assetName);
        const asset = new ImageAsset(assetName, image);
        AssetManager.onAssetLoaded(asset);
    }
}
