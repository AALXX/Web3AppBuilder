import { IAssetLoader } from './IAssetloader';
import { IAsset } from './IAsset';
import { Message } from '../MessageManager/Message';
import { ImageAssetLoader } from './ImageAssetLoader';
export const MESSAGE_ASSET_LOADER_ASSET_LOADED = 'MESSAGE_ASSET_LOADER_ASSET_LOADED::';

/**
 * @param {IAssetLoader} loader
 */
export class AssetsManager {
    private static _loaders: IAssetLoader[] = [];
    private static _loaddedAssets: { [name: string]: IAsset } = {};

    /**
     * Class constructor
     */
    constructor() {

    };

    public static initialize = (): void => {
        AssetsManager._loaders.push(new ImageAssetLoader());
    };

    public static registerLoadder = (loader: IAssetLoader): void => {
        AssetsManager._loaders.push(loader);
    };

    /**
     * A callback to be made from an asset loader when an asset is loaded.
     * @param {IAsset} asset
     */
    public static onAssetLoaded(asset: IAsset): void {
        AssetsManager._loaddedAssets[asset.name] = asset;
        Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
    }

    /**
     * Attempts to load an asset using a registered asset loader.
     * @param {string} assetName The name/url of the asset to be loaded.
     */
    public static loadAsset(assetName: string): void {
        const extension = assetName.split('.').pop().toLowerCase();
        for (const l of AssetsManager._loaders) {
            if (l.supportedExtensions.indexOf(extension) !== -1) {
                l.loadAsset(assetName);
                return;
            }
        }

        console.warn('Unable to load asset with extension ' + extension + ' because there is no loader associated with it.');
    }
    /**
     * Is Sset Loaded check
     * @param {string} assetName
     * @return {boolean}
     */
    public static isAssetLoaded(assetName: string): boolean {
        return AssetsManager._loaddedAssets[assetName] !== undefined;
    }

    /**
     * Get asset func
     * @param {string} assetName
     * @return {IAsset}
     */
    public static getAsset(assetName: string): IAsset {
        if (AssetsManager._loaddedAssets[assetName] !== undefined) {
            return AssetsManager._loaddedAssets[assetName];
        } else {
            AssetsManager.loadAsset(assetName);
        }
        return undefined;
    }
}
