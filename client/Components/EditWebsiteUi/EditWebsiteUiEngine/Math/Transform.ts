import { Matrix4x4 } from './Matrix4x4';
import { Vector3 } from './Vector3';

/**
 * Transform Class
 */
export class Transform {
    public position: Vector3 = Vector3.zero;

    public rotation: Vector3 = Vector3.zero;

    public scale: Vector3 = Vector3.one;


    /**
     * Copy Position
     * @param {Transform }transform
     */
    public copyFrom(transform: Transform): void {
        this.position.copyFrom(transform.position);
        this.rotation.copyFrom(transform.rotation);
        this.scale.copyFrom(transform.scale);
    }

    /**
     * getTransformationMatrix func
     * @return {Matrix4x4}
     */
    public getTransformationMatrix(): Matrix4x4 {
        const translation = Matrix4x4.translation(this.position);

        const rotation = Matrix4x4.rotationXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
        const scale = Matrix4x4.scale(this.scale);


        // Trans * Rot * scale
        return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
    }

    /**
     * Class constructor
     */
    public constructor() {

    }
}
