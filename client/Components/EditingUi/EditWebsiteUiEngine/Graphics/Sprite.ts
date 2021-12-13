import { WebGlBuffer, AttributeInfo } from '../GL/WebGlBuffer';
import { Vector3 } from '../Math/Vector3';

/**
 * Sprite Class
 */
export class Sprite {
    private _name: string;
    private _width: number;
    private _height: number;
    private _buffer: WebGlBuffer;

    public position: Vector3 = new Vector3();

    /**
     * Class Constructor
     * @param {string} name
     * @param {number} width
     * @param {number} height
     */
    public constructor(name: string, width: number = 100, height: number = 100) {
        this._name = name;
        this._width = width;
        this._height = height;
    }

    /**
     * Load Method
     */
    public load(): void {
        this._buffer = new WebGlBuffer(3);

        const PositionAttribute = new AttributeInfo();
        PositionAttribute.location = 0;
        PositionAttribute.offset = 0;
        PositionAttribute.size = 3;

        this._buffer.addAttributeLocation(PositionAttribute);

        const vertices = [
            //* x y z
            0, 0, 0,
            0, this._height, 0,
            this._width, this._height, 0,

            this._width, this._height, 0,
            this._width, 0, 0,
            0, 0, 0,

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
     */
    public draw(): void {
        this._buffer.bind();
        this._buffer.draw();
    }
}
