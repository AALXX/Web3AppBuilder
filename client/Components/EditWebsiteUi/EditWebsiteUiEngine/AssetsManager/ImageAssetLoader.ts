import { AssetManager } from './AssetsManager';
import { IAsset } from './interfaces/IAsset';
import { IAssetLoader } from './interfaces/IAssetloader';
import { TargaProcessor } from './TargaProcessor';

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
    constructor(name: string, data: any) {
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
        const extension = assetName.substring(assetName.lastIndexOf('.') + 1, assetName.length) || assetName;

        /* eslint-disable */

        switch (extension.toLowerCase()) {
            case 'tga':
                // Special targa loading process.
                console.log('Downloading targa file...');
                const request: XMLHttpRequest = new XMLHttpRequest();
                request.responseType = 'arraybuffer';
                request.open('GET', assetName);
                request.addEventListener('load', this.onTgaLoaded.bind(this, assetName, request));
                request.send();
                break;
            default:
                // Normal image loading process.
                const image: HTMLImageElement = new Image();
                image.onload = this.onImageLoaded.bind(this, assetName, image);
                image.src = assetName;
                image.crossOrigin = 'anonymous'
                break;
        }
        /* eslint-enable */
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

    /**
     * on targa file loaded
     * @param {string} assetName
     * @param {XMLHttpRequest} request
     */
    private onTgaLoaded(assetName: string, request: XMLHttpRequest): void {
        console.log('onTgaLoaded: assetName/request', assetName);

        if (request.readyState === request.DONE) {
            const imageDataurl = TargaProcessor.loadToDataUrl(request.response);

            // From the loaded data url, hook into the normal image loading method.
            const image: HTMLImageElement = new Image();
            image.onload = this.onImageLoaded.bind(this, assetName, image);
            image.src = imageDataurl;
        }
    }
}
