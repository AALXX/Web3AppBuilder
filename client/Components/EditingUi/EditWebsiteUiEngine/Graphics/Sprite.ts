import { gl } from '../GL/GLUtilities';
import { Shaders } from '../GL/Shaders';
import { WebGlBuffer, AttributeInfo } from '../GL/WebGlBuffer';
import { Vector3 } from '../Math/Vector3';
import { Texture } from './Texture';
import { TextureManager } from './TextureManager';

/**
 * Sprite Class
 */
export class Sprite {
    private _name: string;
    private _width: number;
    private _height: number;

    private _buffer: WebGlBuffer;
    private _textureName: string;
    private _texture: Texture;

    public position: Vector3 = new Vector3();

    /**
     * Class Constructor
     * @param {string} name
     * @param {string} textureName
     * @param {number} width
     * @param {number} height
     */
    public constructor(name: string, textureName: string, width: number = 100, height: number = 100) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._textureName = textureName;
        this._texture = TextureManager.getTexture(this._textureName);
    }

    /**
     * name accesor
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Destroy Sprite
     */
    public destroy(): void {
        this._buffer.destroy();
        TextureManager.realeaseTexture(this._textureName);
    }

    /**
     * Load Method
     */
    public load(): void {
        this._buffer = new WebGlBuffer(5);

        const positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.offset = 0;
        positionAttribute.size = 3;
        this._buffer.addAttributeLocation(positionAttribute);

        const texCoordAttribute = new AttributeInfo();
        texCoordAttribute.location = 1;
        texCoordAttribute.offset = 3;
        texCoordAttribute.size = 2;
        this._buffer.addAttributeLocation(texCoordAttribute);

        const vertices = [
            // x,y,z   ,u, v
            0, 0, 0, 0, 0,
            0, this._height, 0, 0, 1.0,
            this._width, this._height, 0, 1.0, 1.0,

            this._width, this._height, 0, 1.0, 1.0,
            this._width, 0, 0, 1.0, 0,
            0, 0, 0, 0, 0,
        ];

        this._buffer.pushBackData(vertices);
        this._buffer.upload();
        this._buffer.unBind();
    }

    /**
     * update Met
     * @param {number} time
     */
    public update(time: number): void {

    }

    /**
     * Draw Method
     * @param {Shaders} shader
     */
    public draw(shader: Shaders): void {
        this._texture.activateAndBind(0);

        const diffuseLocation = shader.getUniformLocation('u_diffuse');
        gl.uniform1i(diffuseLocation, 0);

        this._buffer.bind();
        this._buffer.draw();
    }
}
