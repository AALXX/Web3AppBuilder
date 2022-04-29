import { AssetManager } from './AssetsManager';
import { IAsset } from './interfaces/IAsset';
import { IAssetLoader } from './interfaces/IAssetloader';

/**
 * Represents a text file asset.
 */
/**
 * Represents a text file asset.
 */
export class TextAsset implements IAsset {
    /** The name of this asset. */
    public readonly Name: string;

    /** The content of this asset. */
    public readonly Data: string;

    /**
     * Creates a new text asset.
     * @param {string} name The name of this asset.
     * @param {string} data The content of this asset.
     */
    public constructor(name: string, data: string) {
        this.Name = name;
        this.Data = data;
    }
}

/**
 * The loader for a text asset.
 */
export class TextAssetLoader implements IAssetLoader {
    /**
     * The list of supported file extensions.
     */
    public get supportedExtensions(): string[] {
        return ['txt'];
    }

    /**
     * Loads a text asset with the provided name.
     * @param {string} assetName The asset to be loaded.
     */
    public loadAsset(assetName: string): void {
        const request = new XMLHttpRequest();
        request.open('GET', assetName);
        request.addEventListener('load', this.onTextLoaded.bind(this, assetName, request));
        request.send();
    }

    /**
     * Fired when a text asset has loaded.
     * @param {strimg} assetName The name of the asset.
     * @param {XMLHttpRequest} request The request object.
     */
    private onTextLoaded(assetName: string, request: XMLHttpRequest): void {
        console.debug('onTextLoaded: assetName/request', assetName, request);

        if (request.readyState === request.DONE) {
            const asset = new TextAsset(assetName, request.responseText);
            AssetManager.onAssetLoaded(asset);
        }
    }
}
