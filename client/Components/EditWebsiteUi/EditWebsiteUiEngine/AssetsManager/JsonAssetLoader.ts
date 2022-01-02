import { AssetsManager } from './AssetsManager';
import { IAsset } from './IAsset';
import { IAssetLoader } from './IAssetloader';

/**
 * Json Asset
 */
export class JsonAsset implements IAsset {
    public readonly name: string;
    public readonly data: any; // json by default is any

    /**
     * Class Constructor
     * @param {string} name
     * @param {HTMLElement} data
     */
    constructor(name: string, data: any) {
        this.name = name;
        this.data = data;
    }
}

/**
 * JsonAssetLoader class
 */
export class JsonAssetLoader implements IAssetLoader {
    /**
     * Suported image xrensions
     */
    public get supportedExtensions(): string[] {
        return ['json'];
    }

    /**
     *  Loads the asset
     * @param {string} assetURL
     */
    public loadAsset(assetURL: string): void {
        const request: XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', assetURL);
        console.log(request);
        request.addEventListener('load', this.onJsonLoaded.bind(this, assetURL, request));
        request.send();
    }

    /**
     * When Image is Loaded
     * @param {string} assetName
     * @param {XMLHttpRequest} request
     */
    public onJsonLoaded(assetName: string, request: XMLHttpRequest): void {
        console.log('onJsonLoaded: assetName/json', assetName, request);

        if (request.readyState === request.DONE) {
            const jsonParsedObj = JSON.parse(request.responseText);
            const asset = new JsonAsset(assetName, jsonParsedObj);
            AssetsManager.onAssetLoaded(asset);
        }
    }
}
