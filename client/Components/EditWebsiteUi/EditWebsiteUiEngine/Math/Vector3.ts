/**
 * Vector3 class
 */
/** Represents a 3-component vector. */

import { Vector2 } from './Vector2';

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

    /**
     * The x component
     * @param {number} value
     */
    public set x(value: number) {
        this._x = value;
    }

    /** The y component. */
    public get y(): number {
        return this._y;
    }

    /**
     * The y component
     * @param {number} value
     */
    public set y(value: number) {
        this._y = value;
    }

    /** The z component. */
    public get z(): number {
        return this._z;
    }

    /**
     * The z component
     * @param {number} value
     */
    public set z(value: number) {
        this._z = value;
    }

    /**
     * new vector all values 0
     */
    public static get zero(): Vector3 {
        return new Vector3();
    }

    /**
     * new vector all values 1
     */
    public static get one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    /**
     * calculate distance betwen 2 vectors
     * @param {Vector3} a
     * @param {Vector3} b
     * @return {number}
     */
    public static distance(a: Vector3, b: Vector3): number {
        const diff = a.subtract(b);
        return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
    }

    /**
     * set vector
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    public set(x?: number, y?: number, z?: number): void {
        if (x !== undefined) {
            this._x = x;
        }

        if (y !== undefined) {
            this._y = y;
        }

        if (z !== undefined) {
            this._z = z;
        }
    }

    /**
     * Check if this vector is equal to the one passed in.
     * @param {Vector3} v The vector to check against.
     * @return {boolean}
     */
    public equals(v: Vector3): boolean {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    /**
     *  Returns the data of this vector as a number array.
     * @return {number}
     */
    public toArray(): number[] {
        return [this._x, this._y, this._z];
    }

    /**
     * Returns the data of this vector as a Float32Array.
     * @return {Float32Array}
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }

    /**
     * copy from valuesn vector
     * @param {Vector3} vector
     */
    public copyFrom(vector: Vector3): void {
        this._x = vector._x;
        this._y = vector._y;
        this._z = vector._z;
    }

    /**
     * set data from json file
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
     * @param {Vector3} vector
     * @return {Vector3}
     */
    public add(vector: Vector3): Vector3 {
        this._x += vector._x;
        this._y += vector._y;
        this._z += vector._z;

        return this;
    }

    /**
     * subreact vector
     * @param {Vector3} vector
     * @return {Vector3}
     */
    public subtract(vector: Vector3): Vector3 {
        this._x -= vector._x;
        this._y -= vector._y;
        this._z -= vector._z;

        return this;
    }

    /**
     * multiply vector
     * @param {Vector3} vector
     * @return {Vector3}
     */
    public multiply(vector: Vector3): Vector3 {
        this._x *= vector._x;
        this._y *= vector._y;
        this._z *= vector._z;

        return this;
    }

    /**
     * divide vector
     * @param {Vector3} vector
     * @return {Vector3}
     */
    public divide(vector: Vector3): Vector3 {
        this._x /= vector._x;
        this._y /= vector._y;
        this._z /= vector._z;

        return this;
    }

    /**
     * clone Vector
     * @return {Vector3}
     */
    public clone(): Vector3 {
        return new Vector3(this._x, this._y, this._z);
    }

    /**
     * reansforms vector 3 to vector 2
     * @return {Vector2}
     */
    public toVector2(): Vector2 {
        return new Vector2(this._x, this._y);
    }
}
