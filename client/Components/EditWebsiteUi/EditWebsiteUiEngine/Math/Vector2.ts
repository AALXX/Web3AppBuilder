/**
 * Vector3 class
 */
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

    /**
     * new vector all set to 0
     */
    public static get zero(): Vector2 {
        return new Vector2();
    }

    /**
     * new vector all set to 1
     */
    public static get one(): Vector2 {
        return new Vector2(1, 1);
    }

    /**
     * cope vector
     * @param {Vector2} vector
     */
    public copyFrom(vector: Vector2): void {
        this._x = vector._x;
        this._y = vector._y;
    }

    /** Returns the data of this vector as a number array.
     * @return {number}
     */
    public toArray(): number[] {
        return [this._x, this._y];
    }

    /** Returns the data of this vector as a Float32Array.
     * @return {Float32Array}
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }

    /**
     * set vector to one in the json file
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
}
