import { Vector3 } from './Vector3.js';

/**
 * Matrix 4x4 class
 */
export class Matrix4x4 {
    private _data: number[] = [];

    /**
     * Class constructor
     */
    private constructor() {
        this._data = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    /**
     * Get Data
     */
    public get data(): number[] {
        return this._data;
    }

    /**
     * Matrix identity
     * @return {Matrix4x4}
     */
    public static identity(): Matrix4x4 {
        return new Matrix4x4();
    }

    /**
     * ortographic Matrix
     * @param {number} left
     * @param {number} right
     * @param {number} bottom
     * @param {number} top
     * @param {number} nearClip
     * @param {number} farClip
     * @return {Matrix4x4}
     */
    public static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number): Matrix4x4 {
        const matrix = new Matrix4x4();

        const LeftRight: number = 1.0 / (left - right);
        const BottomTop: number = 1.0 / (bottom - top);
        const NearFar: number = 1.0 / (nearClip - farClip);

        matrix._data[0] = -2.0 * LeftRight;
        matrix._data[5] = -2.0 * BottomTop;
        matrix._data[10] = 2.0 * NearFar;

        matrix._data[12] = (left + right) * LeftRight;
        matrix._data[13] = (top + bottom) * BottomTop;
        matrix._data[14] = (nearClip + farClip) * NearFar;


        return matrix;
    }

    /**
     * MAtrix translaton
     * @param {Vector3} position
     * @return {Matrix4x4}
     */
    public static translation(position: Vector3): Matrix4x4 {
        const matrix = new Matrix4x4();

        matrix._data[12] = position.x;
        matrix._data[13] = position.y;
        matrix._data[14] = position.z;

        return matrix;
    }

    /**
    * transforms x, y, z to toFloat32Array
    * @return {number}
    */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this._data);
    }
}
