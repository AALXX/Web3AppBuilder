import { Color } from './Color';
import { Texture } from '../Texture/Texture';
import { TextureManager } from '../Texture/TextureManager';

/**
 * Material calss
 */
export class Material {
    private _name: string;
    private _diffuseTextureName: string;

    private _diffuseTexture: Texture;
    private _tint: Color;

    /**
     * Class constructor
     * @param {string} name
     * @param {string} diffuseTextureName
     * @param {Color} tint
     */
    public constructor(name: string, diffuseTextureName: string, tint: Color) {
        this._name = name;
        this._diffuseTextureName = diffuseTextureName;
        this._tint = tint;

        if (this._diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }
    }

    /** Get Name */
    public get name(): string {
        return this._name;
    }

    /** Get diffuseTextureName  */
    public get diffuseTextureName(): string {
        return this._diffuseTextureName;
    }

    /** Get diffuseTextureName  */
    public get diffuseTexture(): Texture {
        return this._diffuseTexture;
    }

    /** Get tint  */
    public get tint(): Color {
        return this._tint;
    }

    /**
     * Set diffuseTextureName
     * @param {string} value
     */
    public set diffuseTextureName(value: string) {
        if (this._diffuseTextureName !== undefined) {
            TextureManager.realeaseTexture(this._diffuseTextureName); //* release the texture if exists one
        }
        this._diffuseTextureName = value;
        if (this._diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }
    }

    /**
     * It destrys the material
     */
    public destroy(): void {
        TextureManager.realeaseTexture(this.diffuseTextureName);
        this._diffuseTexture = undefined;
    }
}
