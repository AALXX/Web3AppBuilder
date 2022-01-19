import { Vector2 } from '../../Math/Vector2';

export interface IShape2D {
    /** The position of this shape. */
    position: Vector2;

    /** The origin of this shape. */
    origin: Vector2;

    /** The offset of this shape. */
    readonly offset: Vector2;

    setFromJson(json: any): void;

    /**
     * Indicates if this shape intersects the other shape.
     * @param {IShape2D} other The other shape to check.
     */
    intersects(other: IShape2D): boolean;

    /**
     * check if the provide point is in shape
     * @param {Vector2} point
     */
    pointInShape(point: Vector2): boolean;
}
