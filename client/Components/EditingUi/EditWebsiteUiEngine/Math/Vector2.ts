/**
 * Vector3 class
 */
export class Vector2 {
    private _x: number;
    private _y: number;

    /**
     * Class Constructor
     * @param {number} x
     * @param {number} y
     */
    public constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    /**
     * getters for x
     */
    public get x(): number {
        return this._x;
    }

    /**
     * setter for x
     * @param {number} value
     */
    public set x(value: number) {
        this._x = value;
    }

    /**
     * getters for y
     */
    public get y(): number {
        return this._y;
    }

    /**
     * setter for y
     * @param {number} value
     */
    public set y(value: number) {
        this._y = value;
    }

    /**
     * transforms x, y, z to toArray
     * @return {number}
     */
    public toArray(): number[] {
        return [this._x, this._y];
    }

    /**
    * transforms x, y, z to toFloat32Array
    * @return {number}
    */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }
}
