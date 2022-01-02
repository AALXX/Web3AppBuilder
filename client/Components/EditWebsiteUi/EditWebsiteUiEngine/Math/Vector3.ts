/**
 * Vector3 class
 */
export class Vector3 {
    private _x: number;
    private _y: number;
    private _z: number;

    /**
     * Class Constructor
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
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
     * get for z
     */
    public get z(): number {
        return this._z;
    }

    /**
     * set for z
     * @param {number} value
     */
    public set z(value: number) {
        this._z = value;
    }

    /**
     * new vector 3 with zeros
     */
    public static get zero(): Vector3 {
        return new Vector3();
    }

    /**
     * new vector 3 with ones
     */
    public static get one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    /**
     * Creates a copy of matrix m.
     * @param {Vector3} vector The matrix to copy.
     */
    public copyFrom(vector: Vector3): void {
        this._x = vector._x;
        this._y = vector._y;
        this._z = vector._z;
    }

    /**
     * takes data from josn
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.x !== undefined) {
            this._x = Number(json.x);
        }

        if (json.y !== undefined) {
            this._y = Number(json.y);
        }

        if (json.z !== undefined) {
            this._z = Number(json.z);
        }
    }

    /**
     * transforms x, y, z to toArray
     * @return {number}
     */
    public toArray(): number[] {
        return [this._x, this._y, this._z];
    }

    /**
     * transforms x, y, z to toFloat32Array
     * @return {number}
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }
}
