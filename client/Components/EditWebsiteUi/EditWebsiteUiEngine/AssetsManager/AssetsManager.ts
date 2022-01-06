import { IAssetLoader } from './IAssetloader';
import { IAsset } from './IAsset';
import { Message } from '../MessageManager/Message';
import { ImageAssetLoader } from './ImageAssetLoader';
import { JsonAssetLoader } from './JsonAssetLoader';

export const MESSAGE_ASSET_LOADER_ASSET_LOADED = 'MESSAGE_ASSET_LOADER_ASSET_LOADED::';

/**
 * @param {IAssetLoader} loader
 */
export class AssetManager {
    private static _loaders: IAssetLoader[] = [];
    private static _loadedAssets: { [name: string]: IAsset } = {};

    /** Private to enforce static method calls and prevent instantiation. */
    private constructor() {}

    public static initialize(): void {
        AssetManager._loaders.push(new ImageAssetLoader());
        AssetManager._loaders.push(new JsonAssetLoader());
    }

    public static registerLoadder = (loader: IAssetLoader): void => {
        AssetManager._loaders.push(loader);
    };

    /**
     * A callback to be made from an asset loader when an asset is loaded.
     * @param {IAsset} asset
     */
    public static onAssetLoaded(asset: IAsset): void {
        AssetManager._loadedAssets[asset.name] = asset;
        Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
    }

    /**
     * Attempts to load an asset using a registered asset loader.
     * @param {string} assetName The name/url of the asset to be loaded.
     */
    public static loadAsset(assetName: string): void {
        const extension = assetName.split('.').pop().toLowerCase();
        for (const l of AssetManager._loaders) {
            if (l.supportedExtensions.indexOf(extension) !== -1) {
                l.loadAsset(assetName);
                return;
            }
        }

        console.warn('Unable to load asset with extension ' + extension + ' because there is no loader associated with it.');
    }

    /**
     * Indicates if an asset with the provided name has been loaded.
     * @param {string} assetName The asset name to check.
     * @return {boolean}
     */
    public static isAssetLoaded(assetName: string): boolean {
        return AssetManager._loadedAssets[assetName] !== undefined;
    }

    /**
     * Attempts to get an asset with the provided name. If found, it is returned; otherwise, undefined is returned.
     * @param {string} assetName The asset name to get.
     * @return {IAsset}
     */
    public static getAsset(assetName: string): IAsset {
        if (AssetManager._loadedAssets[assetName] !== undefined) {
            return AssetManager._loadedAssets[assetName];
        } else {
            AssetManager.loadAsset(assetName);
        }

        return undefined;
    }
}
