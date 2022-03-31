import { Color } from './Color';
import { Texture } from '../Texture/Texture';
import { TextureManager } from '../Texture/TextureManager';
import { ShaderManager } from '../ShaderManager';
import { BuiltinShader, Shaders } from '../../GL/Shaders';
import { MaterialConfig } from './MaterialManager';
import { Matrix4x4 } from '../../Math/Matrix4x4';

/** A material represents surface information which is used during rendering. */
export class Material {
    private _name: string;
    private _diffuseTextureName: string;

    private _shader: Shaders;
    private _diffuseTexture: Texture;
    private _tint: Color;

    /**
     * Creates a new material.
     * @param {string} name The name of this material.
     * @param {Shaders} shader The shader used by this material.
     * @param {string} diffuseTextureName The name of the diffuse texture.
     * @param {Color} tint The color value of the tint to apply to the material.
     */
    public constructor(name: string, shader: Shaders, diffuseTextureName: string, tint: Color) {
        this._name = name;
        this._shader = shader;
        this._diffuseTextureName = diffuseTextureName;
        this._tint = tint;

        if (this._diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }
    }

    /**
     * Creates a material from the provided configuration.
     * @param {MaterialConfig} config The configuration to create a material from.
     * @return {Material}
     */
    public static fromConfig(config: MaterialConfig): Material {
        const name = config.shader ? config.shader : BuiltinShader.BASIC;
        // eslint-disable-next-line new-cap
        const shader = ShaderManager.getShader(name);
        if (shader === undefined) {
            throw new Error('Unable to create material using material named ${name} as it is undefined.');
        }
        return new Material(config.name, shader, config.diffuse, config.tint);
    }

    /**
     * Applies this material.
     * @param {Matrix4x4} model The model matrix to be applied.
     * @param {Matrix4x4} view The view matrix to be applied.
     * @param {Matrix4x4} projection The projection matrix to be applied.
     */
    public apply(model: Matrix4x4, view: Matrix4x4, projection: Matrix4x4): void {
        this._shader.applyStandardUniforms(this, model, view, projection);
    }

    /** The name of this material. */
    public get name(): string {
        return this._name;
    }

    /** The name of the diffuse texture. */
    public get diffuseTextureName(): string {
        return this._diffuseTextureName;
    }

    /** The diffuse texture. */
    public get diffuseTexture(): Texture {
        return this._diffuseTexture;
    }

    /** The color value of the tint to apply to the material. */
    public get tint(): Color {
        return this._tint;
    }

    /** Sets the diffuse texture name, which triggers a texture load if need be.
     * @param {string} value
     */
    public set diffuseTextureName(value: string) {
        if (this._diffuseTexture !== undefined) {
            TextureManager.releaseTexture(this._diffuseTextureName);
        }

        this._diffuseTextureName = value;

        if (this._diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }
    }

    /** Destroys this material. */
    public destroy(): void {
        TextureManager.releaseTexture(this._diffuseTextureName);
        this._diffuseTexture = undefined;
    }
}
