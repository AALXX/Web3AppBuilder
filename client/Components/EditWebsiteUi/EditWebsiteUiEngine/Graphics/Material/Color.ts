/**
 * Color Class
 */
export class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    /**
     * Class constructor
     * @param {number} R
     * @param {number} G
     * @param {number} B
     * @param {number} A
     */
    public constructor(R: number = 255, G: number = 255, B: number = 255, A: number = 255) {
        this._r = R;
        this._g = G;
        this._b = B;
        this._a = A;
    }

    /** Getter for Red */
    public get r(): number {
        return this._r;
    }

    /** Getter for Red Float */
    public get rFloat(): number {
        return this._r / 255.0;
    }

    /** Setter for Red
     * @param {number} value
     */
    public set r(value: number) {
        this._r = value;
    }

    /** Getter for Green */
    public get g(): number {
        return this._g;
    }

    /** Getter for Green Float */
    public get gFloat(): number {
        return this._g / 255.0;
    }

    /** Setter for Green
     * @param {number} value
     */
    public set g(value: number) {
        this._g = value;
    }

    /** Getter for Blue */
    public get b(): number {
        return this._b;
    }

    /** Getter for Blue Float */
    public get bFloat(): number {
        return this._b / 255.0;
    }

    /** Setter for Blue
     * @param {number} value
     */
    public set b(value: number) {
        this._b = value;
    }

    /** Getter for Alpha */
    public get a(): number {
        return this._a;
    }

    /** Getter for Blue Alpha */
    public get aFloat(): number {
        return this._a / 255.0;
    }

    /** Setter for Alpha
     * @param {number} value
     */
    public set a(value: number) {
        this._a = value;
    }

    /**
     * RGBA to array
     * @return {number[]}
     */
    public toArray(): number[] {
        return [this._r, this._g, this._b, this._a];
    }

    /**
     * RGBA to Float Array
     * @return {number[]}
     */
    public toFloatArray(): number[] {
        return [this._r / 255.0, this._g / 255.0, this._b / 255.0, this._a / 255.0];
    }

    /**
     * RGBA to Float Array
     * @return {number[]}
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toFloatArray());
    }

    /**
     * Creates a new color from the provided JSON.
     * @param {any} json The JSON to create from.
     * @return {Color}
     */
    public static fromJson(json: any): Color {
        const c = new Color();
        if (json.r !== undefined) {
            c.r = Number(json.r);
        }
        if (json.g !== undefined) {
            c.g = Number(json.g);
        }
        if (json.b !== undefined) {
            c.b = Number(json.b);
        }
        if (json.a !== undefined) {
            c.a = Number(json.a);
        }
        return c;
    }

    /** White Color ShortCut
     * @return {Color}
     */
    public static white(): Color {
        return new Color(255, 255, 255, 255);
    }

    /** White Color ShortCut
     * @return {Color}
     */
    public static black(): Color {
        return new Color(0, 0, 0, 255);
    }

    /** Red Color ShortCut
     * @return {Color}
     */
    public static red(): Color {
        return new Color(255, 0, 0, 255);
    }

    /** Green Color ShortCut
     * @return {Color}
     */
    public static green(): Color {
        return new Color(0, 255, 0, 255);
    }

    /** Blue Color ShortCut
     * @return {Color}
     */
    public static blue(): Color {
        return new Color(0, 0, 255, 255);
    }
}
