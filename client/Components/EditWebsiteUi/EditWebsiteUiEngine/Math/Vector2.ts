/**
 * Vector3 class
 */

import { Vector3 } from './Vector3';

/** Represents a 2-component vector. */
export class Vector2 {
    private _x: number;
    private _y: number;

    /**
     * Creates a new vector 2.
     * @param {number} x The x component.
     * @param {number} y The y component.
     */
    public constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
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

    /**
     * new vector all values 0
     */
    public static get zero(): Vector2 {
        return new Vector2();
    }

    /**
     * new vector all values 0
     */
    public static get one(): Vector2 {
        return new Vector2(1, 1);
    }

    /**
     * calculates the distance betwen 2 vectors
     * @param {Vector2} a
     * @param {Vector2} b
     * @return {number}
     */
    public static distance(a: Vector2, b: Vector2): number {
        const diff = a.clone().subtract(b);
        return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    }

    /**
     * copy values from another vector
     * @param {Vector2} vector
     */
    public copyFrom(vector: Vector2): void {
        this._x = vector._x;
        this._y = vector._y;
    }

    /**
     * Returns the data of this vector as a number array.
     * @return {number}
     */
    public toArray(): number[] {
        return [this._x, this._y];
    }

    /**
     * Returns the data of this vector as a Float32Array.
     * @return {Float32Array}
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }

    /**
     * transfrom vec2 to vec3
     * @return {Vector3}
     */
    public toVector3(): Vector3 {
        return new Vector3(this._x, this._y, 0);
    }

    /**
     * set vector
     * @param {number} x
     * @param {number} y
     */
    public set(x?: number, y?: number): void {
        if (x !== undefined) {
            this._x = x;
        }

        if (y !== undefined) {
            this._y = y;
        }
    }

    /**
     * set data from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.x !== undefined) {
            this._x = Number(json.x);
        }

        if (json.y !== undefined) {
            this._y = Number(json.y);
        }
    }

    /**
     * add vector
     * @param {Vector2} vector
     * @return {Vector2}
     */
    public add(vector: Vector2): Vector2 {
        this._x += vector._x;
        this._y += vector._y;

        return this;
    }

    /**
     * add vector
     * @param {Vector2} vector
     * @return {Vector2}
     */
    public subtract(vector: Vector2): Vector2 {
        this._x -= vector._x;
        this._y -= vector._y;

        return this;
    }

    /**
     * add vector
     * @param {Vector2} vector
     * @return {Vector2}
     */
    public multiply(vector: Vector2): Vector2 {
        this._x *= vector._x;
        this._y *= vector._y;

        return this;
    }

    /**
     * add vector
     * @param {Vector2} vector
     * @return {Vector2}
     */
    public divide(vector: Vector2): Vector2 {
        this._x /= vector._x;
        this._y /= vector._y;

        return this;
    }

    /**
     * sclae the vector
     * @param {number} scale
     * @return {Vector2}
     */
    public scale(scale: number): Vector2 {
        this._x *= scale;
        this._x *= scale;

        return this;
    }

    /**
     * clone vector
     * @return {Vector2}
     */
    public clone(): Vector2 {
        return new Vector2(this._x, this._y);
    }
}
