import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../../AssetsManager/AssetsManager';
import { JsonAsset } from '../../AssetsManager/JsonAssetLoader';
import { Message } from '../../MessageManager/Message';
import { Color } from './Color';
import { Material } from './Material';

/**
 * Holds reference information for a given material.
 */
class MaterialReferenceNode {
    /** The referenced material. */
    public material: Material;

    /** The number of times the material is referenced. Default is 1 because this is only created when a material is needed. */
    public referenceCount: number = 1;

    /**
     * Creates a new MaterialReferenceNode.
     * @param {Material} material The material to be referenced.
     */
    public constructor(material: Material) {
        this.material = material;
    }
}

/** Represents the configuration for a material. These are typically created and stored in a materials file. */
export class MaterialConfig {
    /** The name of this material. */
    public name: string;

    /** The name of the shader used by this material. Default: undefined (BuiltinShader.BASIC) */
    public shader?: string;

    /** The diffuse texture path of this material. */
    public diffuse: string;

    /** The specular texture path of this material. */
    public specular: string;

    /** The tint of this material. */
    public tint: Color;

    /**
     * set datat from json
     * @param {any} json
     * @return {MaterialConfig}
     */
    public static fromJson(json: any): MaterialConfig {
        const config = new MaterialConfig();
        if (json.name !== undefined) {
            config.name = String(json.name);
        }

        if (json.shader !== undefined) {
            config.shader = String(json.shader);
        }

        if (json.diffuse !== undefined) {
            config.diffuse = String(json.diffuse);
        }

        if (json.specular !== undefined) {
            config.specular = String(json.specular);
        }

        if (json.tint !== undefined) {
            config.tint = Color.fromJson(json.tint);
        } else {
            config.tint = Color.white();
        }

        return config;
    }
}

/**
 * Manages materials in the engine. This is responsible for managing material references, and automatically
 * destroying unreferenced materials.
 */
export class MaterialManager {
    private static _configLoaded: boolean = false;
    private static _materials: { [name: string]: MaterialReferenceNode } = {};
    private static _materialConfigs: { [name: string]: MaterialConfig } = {};

    /** Private to enforce singleton pattern. */
    private constructor() {}

    /** Indicates if this manager is loaded. */
    public static get isLoaded(): boolean {
        return MaterialManager._configLoaded;
    }

    /**
     * The message handler.
     * @param {Message} message The message to be handled.
     */
    public static onMessage(message: Message): void {
        // TODO: one for each asset.
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + 'http://localhost:9000/kw8rybzkj4ova9uyj1/assets/Materials/baseMaterials.json') {
            Message.unsubscribeCallback(MESSAGE_ASSET_LOADER_ASSET_LOADED + 'http://localhost:9000/kw8rybzkj4ova9uyj1/assets/Materials/baseMaterials.json', MaterialManager.onMessage);

            MaterialManager.processMaterialAsset(message.context as JsonAsset);
        }
    }

    /** Loads this manager. */
    public static load(): void {
        // Get the asset(s). TODO: This probably should come from a central asset manifest.
        const asset = AssetManager.getAsset('http://localhost:9000/kw8rybzkj4ova9uyj1/assets/Materials/baseMaterials.json');
        if (asset !== undefined) {
            MaterialManager.processMaterialAsset(asset as JsonAsset);
        } else {
            // Listen for the asset load.
            Message.subscribeCallback(MESSAGE_ASSET_LOADER_ASSET_LOADED + 'http://localhost:9000/kw8rybzkj4ova9uyj1/assets/Materials/baseMaterials.json', MaterialManager.onMessage);
        }
    }

    /**
     * Registers the provided material with this manager.
     * @param {MaterialConfig} materialConfig The material to be registered.
     */
    public static registerMaterial(materialConfig: MaterialConfig): void {
        if (MaterialManager._materialConfigs[materialConfig.name] === undefined) {
            MaterialManager._materialConfigs[materialConfig.name] = materialConfig;
        }
    }

    /**
     * Gets a material with the given name. This is case-sensitive. If no material is found, undefined is returned.
     * Also increments the reference count by 1.
     * @param {string} materialName The name of the material to retrieve. Case sensitive.
     * @return {Material}
     */
    public static getMaterial(materialName: string): Material {
        if (MaterialManager._materials[materialName] === undefined) {
            // Check if a config is registered.
            if (MaterialManager._materialConfigs[materialName] !== undefined) {
                const mat = Material.fromConfig(MaterialManager._materialConfigs[materialName]);
                MaterialManager._materials[materialName] = new MaterialReferenceNode(mat);
                return MaterialManager._materials[materialName].material;
            }
            return undefined;
        } else {
            MaterialManager._materials[materialName].referenceCount++;
            return MaterialManager._materials[materialName].material;
        }
    }

    /**
     * Releases a reference of a material with the provided name and decrements the reference count.
     * If the material's reference count is 0, it is automatically released.
     * @param {string} materialName The name of the material to be released.
     */
    public static releaseMaterial(materialName: string): void {
        if (MaterialManager._materials[materialName] === undefined) {
            console.warn('Cannot release a material which has not been registered.');
        } else {
            MaterialManager._materials[materialName].referenceCount--;
            if (MaterialManager._materials[materialName].referenceCount < 1) {
                MaterialManager._materials[materialName].material.destroy();
                MaterialManager._materials[materialName].material = undefined;
                delete MaterialManager._materials[materialName];
            }
        }
    }

    /**
     * process material asset
     * @param {JsonAsset} asset
     */
    private static processMaterialAsset(asset: JsonAsset): void {
        const materials = asset.data.materials;
        if (materials) {
            for (const material of materials) {
                const c = MaterialConfig.fromJson(material);
                MaterialManager.registerMaterial(c);
            }
        }

        // TODO: Should only set this if ALL queued assets have loaded.
        MaterialManager._configLoaded = true;
    }
}
