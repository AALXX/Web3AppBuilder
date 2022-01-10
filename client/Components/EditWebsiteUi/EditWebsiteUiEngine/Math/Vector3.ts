/**
 * Vector3 class
 */
/** Represents a 3-component vector. */
export class Vector3 {
    private _x: number;
    private _y: number;
    private _z: number;

    /**
     * Creates a new vector 3.
     * @param {number} x The x component.
     * @param {number} y The y component.
     * @param {number} z The z component.
     */
    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    /** The x component. */
    public get x(): number {
        return this._x;
    }

    /** The x component.
     * @param {number} value
     */
    public set x(value: number) {
        this._x = value;
    }

    /** The y component. */
    public get y(): number {
        return this._y;
    }

    /** The y component.
     * @param {number} value
     */
    public set y(value: number) {
        this._y = value;
    }

    /** The z component. */
    public get z(): number {
        return this._z;
    }

    /** The z component.
     * @param {number} value
     */
    public set z(value: number) {
        this._z = value;
    }

    /**
     * new vector all set to 0
     */
    public static get zero(): Vector3 {
        return new Vector3();
    }

    /**
     * new vector all values set to 1
     */
    public static get one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    /**
     * Returns the data of this vector as a number array.
     * @return {number}
     */
    public toArray(): number[] {
        return [this._x, this._y, this._z];
    }

    /** Returns the data of this vector as a Float32Array.
     * @return {Float32Array}
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }

    /**
     * cope vector
     * @param {Vector3} vector
     */
    public copyFrom(vector: Vector3): void {
        this._x = vector._x;
        this._y = vector._y;
        this._z = vector._z;
    }

    /**
     * set vector from json
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
     * add vector
     * @param {Vector3} v
     * @return {Vector3}
     */
    public add(v: Vector3): Vector3 {
        this._x += v._x;
        this._y += v._y;
        this._z += v._z;

        return this;
    }

    /**
     * subtract vector
     * @param {Vector3} v
     * @return {Vector3}
     */
    public subtract(v: Vector3): Vector3 {
        this._x -= v._x;
        this._y -= v._y;
        this._z -= v._z;

        return this;
    }

    /**
     * multiply vector
     * @param {Vector3} v
     * @return {Vector3}
     */
    public multiply(v: Vector3): Vector3 {
        this._x *= v._x;
        this._y *= v._y;
        this._z *= v._z;

        return this;
    }

    /**
     * divide vector
     * @param {Vector3} v
     * @return {Vector3}
     */
    public divide(v: Vector3): Vector3 {
        this._x /= v._x;
        this._y /= v._y;
        this._z /= v._z;

        return this;
    }
}
