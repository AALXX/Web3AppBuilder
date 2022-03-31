import { AttributeInfo, GLBuffer } from '../GL/WebGlBuffer';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { Vector3 } from '../Math/Vector3';
import { Material } from './Material/Material';
import { MaterialManager } from './Material/MaterialManager';
import { Vertex } from './Vertex';

/**
 * Sprite Class
 */
export class Sprite {
    protected _name: string;
    protected _width: number;
    protected _height: number;
    protected _origin: Vector3 = Vector3.zero;

    protected _buffer: GLBuffer;
    protected _materialName: string;
    protected _material: Material;
    protected _vertices: Vertex[] = [];

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
     * origin accessor
     */
    public get origin(): Vector3 {
        return this._origin;
    }

    /**
     * origin setter
     * @param {Vector3} value
     */
    public set origin(value: Vector3) {
        this._origin = value;
        this.recalculateVertices();
    }

    /**
     * Destroy Sprite
     */
    public destroy(): void {
        if (this._buffer) {
            this._buffer.destroy();
        }
        if (this._material) {
            MaterialManager.releaseMaterial(this._materialName);
            this._material = undefined;
            this._materialName = undefined;
        }
    }

    /**
     * Load Method
     */
    public load(): void {
        this._buffer = new GLBuffer();

        const positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.size = 3;
        this._buffer.addAttributeLocation(positionAttribute);

        const texCoordAttribute = new AttributeInfo();
        texCoordAttribute.location = 1;
        texCoordAttribute.size = 2;
        this._buffer.addAttributeLocation(texCoordAttribute);

        this.calculateVertices();
    }

    /**
     * update Method
     * @param {number} time
     */
    public update(time: number): void {}

    /**
     * Draw Method
     * @param {Matrix4x4} model
     * @param {Matrix4x4} view
     * @param {Matrix4x4} projection
     */
    public draw(model: Matrix4x4, view: Matrix4x4, projection: Matrix4x4): void {
        // console.log(this._material);
        this._material.apply(model, view, projection);
        this._buffer.bind();
        this._buffer.draw();
    }

    /**
     * ir calculates vertices
     */
    protected calculateVertices(): void {
        const minX = -(this._width * this._origin.x);
        const maxX = this._width * (1.0 - this._origin.x);

        const minY = -(this._height * this._origin.y);
        const maxY = this._height * (1.0 - this._origin.y);

        this._vertices = [
            // x,y,z   ,u, v
            new Vertex(minX, minY, 0, 0, 0),
            new Vertex(minX, maxY, 0, 0, 1.0),
            new Vertex(maxX, maxY, 0, 1.0, 1.0),

            new Vertex(maxX, maxY, 0, 1.0, 1.0),
            new Vertex(maxX, minY, 0, 1.0, 0),
            new Vertex(minX, minY, 0, 0, 0),
        ];

        for (const v of this._vertices) {
            this._buffer.pushBackData(v.toArray());
        }

        this._buffer.upload();
        this._buffer.unbind();
    }

    /**
     * it recalcuates vertices
     */
    protected recalculateVertices(): void {
        const minX = -(this._width * this._origin.x);
        const maxX = this._width * (1.0 - this._origin.x);

        const minY = -(this._height * this._origin.y);
        const maxY = this._height * (1.0 - this._origin.y);

        this._vertices[0].position.set(minX, minY);
        this._vertices[1].position.set(minX, maxY);
        this._vertices[2].position.set(maxX, maxY);

        this._vertices[3].position.set(maxX, maxY);
        this._vertices[4].position.set(maxX, minY);
        this._vertices[5].position.set(minX, minY);

        this._buffer.clearData();
        for (const v of this._vertices) {
            this._buffer.pushBackData(v.toArray());
        }

        this._buffer.upload();
        this._buffer.unbind();
    }
}
