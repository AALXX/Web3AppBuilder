import { Texture } from './Texture';

/**
 * Texture Reference Node class
 */
export class TextureReferenceNode {
    public texture: Texture;
    public referenceCount: number = 1;

    /**
     * class construcort
     * @param {Texture} texture
     */
    public constructor(texture: Texture) {
        this.texture = texture;
    }
}

/**
 * Texture manager class
 */
export class TextureManager {
    private static _textures: { [name: string]: TextureReferenceNode } = {}; //* textures dictionary

    /**
     * class constructor
     */
    private constructor() {}

    /**
     * Get texture
     * @param {string} textureName
     * @return {Texture}
     */
    public static getTexture(textureName: string): Texture {
        if (TextureManager._textures[textureName] === undefined) {
            const texture = new Texture(textureName);
            TextureManager._textures[textureName] = new TextureReferenceNode(texture);
        } else {
            TextureManager._textures[textureName].referenceCount++;
        }

        return TextureManager._textures[textureName].texture;
    }

    /**
     * It realeasees the Texture
     * @param {string} textureName
     */
    public static releaseTexture(textureName: string): void {
        if (TextureManager._textures[textureName] === undefined) {
            console.warn(`A texture named ${textureName} does not exist and therefore cannot be released.`);
        } else {
            TextureManager._textures[textureName].referenceCount--;
            if (TextureManager._textures[textureName].referenceCount < 1) {
                TextureManager._textures[textureName].texture.destroy();
                TextureManager._textures[textureName] = undefined;
                delete TextureManager._textures[textureName];
            }
        }
    }
}
