import { AssetManager } from './AssetsManager';
import { IAsset } from './interfaces/IAsset';
import { IAssetLoader } from './interfaces/IAssetloader';

/** Represents an Json asset */
export class JsonAsset implements IAsset {
    /** The name of this asset. */
    public readonly name: string;

    /** The data of this asset. */
    public readonly data: any;

    /**
     * Creates a new image asset.
     * @param {string} name The name of this asset.
     * @param {any} data The data of this asset.
     */
    public constructor(name: string, data: any) {
        this.name = name;
        this.data = data;
    }
}

/** Represents an Json asset loader. */
export class JsonAssetLoader implements IAssetLoader {
    /** The extensions supported by this asset loader. */
    public get supportedExtensions(): string[] {
        return ['json'];
    }

    /**
     * Loads an asset with the given name.
     * @param {string} assetName The name of the asset to be loaded.
     */
    public loadAsset(assetName: string): void {
        const request: XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', assetName);
        request.addEventListener('load', this.onJsonLoaded.bind(this, assetName, request));
        request.send();
    }

    /**
     * On jsonLoaded Event
     * @param {string} assetName
     * @param {XMLHttpRequest} request
     */
    private onJsonLoaded(assetName: string, request: XMLHttpRequest): void {
        console.log('onJsonLoaded: assetName/request', assetName, request);

        if (request.readyState === request.DONE) {
            const json = JSON.parse(request.responseText);
            const asset = new JsonAsset(assetName, json);
            AssetManager.onAssetLoaded(asset);
        }
    }
}
