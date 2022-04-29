/**
 * custom math class
 */
export class CustomMath {
    /** Private to enforce static method calls and prevent instantiation. */
    private constructor() {}

    /**
     * degress to Radious
     * @param {number} degrees
     * @return {number}
     */
    public static degToRad(degrees: number): number {
        return (degrees * Math.PI) / 180.0;
    }
}
