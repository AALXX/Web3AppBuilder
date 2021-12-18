import { gl } from '../GL/GLUtilities';
import { Shaders } from '../GL/Shaders';
import { WebGlBuffer, AttributeInfo } from '../GL/WebGlBuffer';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { Vector3 } from '../Math/Vector3';
import { Material } from './Material/Material';
import { MaterialManager } from './Material/MaterialManager';

/**
 * Sprite Class
 */
export class Sprite {
    private _name: string;
    private _width: number;
    private _height: number;

    private _buffer: WebGlBuffer;
    private _materialName: string;
    private _material: Material;

    public position: Vector3 = new Vector3();

    /**
     * Class Constructor
     * @param {string} name
     * @param {string} materialName
     * @param {number} width
     * @param {number} height
     */
    public constructor(name: string, materialName: string, width: number = 100, height: number = 100) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._materialName = materialName;
        this._material = MaterialManager.getMaterial(this._materialName);
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
        MaterialManager.releaseMaterial(this._materialName);
        this._material = undefined;
        this._materialName = undefined;
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
        const ModelLocation = shader.getUniformLocation('u_model');
        gl.uniformMatrix4fv(ModelLocation, false, new Float32Array(Matrix4x4.translation(this.position).data));

        //* Set Uniforms
        const ColorLocation = shader.getUniformLocation('u_tint');
        gl.uniform4fv(ColorLocation, this._material.tint.toFloat32Array());

        if (this._material.diffuseTexture !== undefined) {
            this._material.diffuseTexture.activateAndBind(0);
            const diffuseLocation = shader.getUniformLocation('u_diffuse');
            gl.uniform1i(diffuseLocation, 0);
        }

        this._buffer.bind();
        this._buffer.draw();
    }
}
