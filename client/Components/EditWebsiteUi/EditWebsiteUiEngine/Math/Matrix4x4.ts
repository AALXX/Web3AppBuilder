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
     * Creates a rotation matrix on the X axis from the provided angle in radians.
     * @param {number} angleInRadians The angle in radians.
     * @return {Matrix4x4}
     */
    public static rotationX(angleInRadians: number): Matrix4x4 {
        const m = new Matrix4x4();

        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        m._data[5] = c;
        m._data[6] = s;
        m._data[9] = -s;
        m._data[10] = c;

        return m;
    }

    /**
     * Creates a rotation matrix on the Y axis from the provided angle in radians.
     * @param {number} angleInRadians The angle in radians.
     * @return {Matrix4x4}
     */
    public static rotationY(angleInRadians: number): Matrix4x4 {
        const m = new Matrix4x4();

        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        m._data[0] = c;
        m._data[2] = -s;
        m._data[8] = s;
        m._data[10] = c;

        return m;
    }

    /**
     * Creates a rotation matrix on the Z axis from the provided angle in radians.
     * @param {number} angleInRadians The angle in radians.
     * @return {Matrix4x4}
     */
    public static rotationZ(angleInRadians: number): Matrix4x4 {
        const m = new Matrix4x4();

        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        m._data[0] = c;
        m._data[1] = s;
        m._data[4] = -s;
        m._data[5] = c;

        return m;
    }

    /**
     * Creates a rotation matrix from the provided angles in radians.
     * @param {number} xRadians The angle in radians on the X axis.
     * @param {number} yRadians The angle in radians on the Y axis.
     * @param {number} zRadians The angle in radians on the Z axis.
     * @return {Matrix4x4}
     */
    public static rotationXYZ(xRadians: number, yRadians: number, zRadians: number): Matrix4x4 {
        const rx = Matrix4x4.rotationX(xRadians);
        const ry = Matrix4x4.rotationY(yRadians);
        const rz = Matrix4x4.rotationZ(zRadians);

        // ZYX
        return Matrix4x4.multiply(Matrix4x4.multiply(rz, ry), rx);
    }

    /**
     * Creates a scale matrix.
     * @param {Vector3} scale The scale to use.
     * @return {Matrix4x4}
     */
    public static scale(scale: Vector3): Matrix4x4 {
        const m = new Matrix4x4();

        m._data[0] = scale.x;
        m._data[5] = scale.y;
        m._data[10] = scale.z;

        return m;
    }

    /**
     * Multyply to matrixes
     * @param {Matrix4x4} a
     * @param {Matrix4x4} b
     * @return {Matrix4x4}
     */
    public static multiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
        const m = new Matrix4x4();

        const b00 = b._data[0 * 4 + 0];
        const b01 = b._data[0 * 4 + 1];
        const b02 = b._data[0 * 4 + 2];
        const b03 = b._data[0 * 4 + 3];
        const b10 = b._data[1 * 4 + 0];
        const b11 = b._data[1 * 4 + 1];
        const b12 = b._data[1 * 4 + 2];
        const b13 = b._data[1 * 4 + 3];
        const b20 = b._data[2 * 4 + 0];
        const b21 = b._data[2 * 4 + 1];
        const b22 = b._data[2 * 4 + 2];
        const b23 = b._data[2 * 4 + 3];
        const b30 = b._data[3 * 4 + 0];
        const b31 = b._data[3 * 4 + 1];
        const b32 = b._data[3 * 4 + 2];
        const b33 = b._data[3 * 4 + 3];
        const a00 = a._data[0 * 4 + 0];
        const a01 = a._data[0 * 4 + 1];
        const a02 = a._data[0 * 4 + 2];
        const a03 = a._data[0 * 4 + 3];
        const a10 = a._data[1 * 4 + 0];
        const a11 = a._data[1 * 4 + 1];
        const a12 = a._data[1 * 4 + 2];
        const a13 = a._data[1 * 4 + 3];
        const a20 = a._data[2 * 4 + 0];
        const a21 = a._data[2 * 4 + 1];
        const a22 = a._data[2 * 4 + 2];
        const a23 = a._data[2 * 4 + 3];
        const a30 = a._data[3 * 4 + 0];
        const a31 = a._data[3 * 4 + 1];
        const a32 = a._data[3 * 4 + 2];
        const a33 = a._data[3 * 4 + 3];

        m._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        m._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        m._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        m._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        m._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        m._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        m._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        m._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        m._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        m._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        m._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        m._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        m._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        m._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        m._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        m._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

        return m;
    }

    /**
    * transforms x, y, z to toFloat32Array
    * @return {number}
    */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this._data);
    }

    /**
    * Creates a copy of matrix m.
    * @param {Matrix4x4} m The matrix to copy.
    */
    public copyFrom(m: Matrix4x4): void {
        for (let i = 0; i < 16; ++i) {
            this._data[i] = m._data[i];
        }
    }
}