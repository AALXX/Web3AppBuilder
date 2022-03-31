import { Vector2 } from '../../Math/Vector2';
import { Circle2D } from './circle2D';
import { IShape2D } from './IShape2D';

/**
 * Rectangle2D class
 */
export class Rectangle2D implements IShape2D {
    public position: Vector2 = Vector2.zero;

    public origin: Vector2 = new Vector2(0.5, 0.5);

    public width: number;

    public height: number;

    /**
     * Creates a new rectangle.
     * @param {number}x The x position of this shape.
     * @param {number}y The y position of this shape.
     * @param {number}width The width of this shape.
     * @param {number}height The height of this shape.
     */
    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * get offset
     */
    public get offset(): Vector2 {
        return new Vector2(-(this.width * this.origin.x), -(this.height * this.origin.y));
    }

    /**
     * setd data from json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.position !== undefined) {
            this.position.setFromJson(json.position);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJson(json.origin);
        }

        if (json.width === undefined) {
            throw new Error('Rectangle2D requires width to be present.');
        }
        this.width = Number(json.width);

        if (json.height === undefined) {
            throw new Error('Rectangle2D requires height to be present.');
        }
        this.height = Number(json.height);
    }

    /**
     * check if intersects
     * @param {IShape2D} other
     * @return {boolean}
     */
    public intersects(other: IShape2D): boolean {
        if (other instanceof Rectangle2D) {
            const a = this.getExtents(this);
            const b = this.getExtents(other);

            return a.position.x <= b.width && a.width >= b.position.x && a.position.y <= b.height && a.height >= b.position.y;
        }

        if (other instanceof Circle2D) {
            const deltaX = other.position.x - Math.max(this.position.x, Math.min(other.position.x, this.position.x + this.width));
            const deltaY = other.position.y - Math.max(this.position.y, Math.min(other.position.y, this.position.y + this.height));
            if (deltaX * deltaX + deltaY * deltaY < other.radius * other.radius) {
                return true;
            }
        }

        return false;
    }

    /**
     * check point in shape
     * @param {Vector2} point
     * @return {Vector2}
     */
    public pointInShape(point: Vector2): boolean {
        const x = this.width < 0 ? this.position.x - this.width : this.position.x;
        const y = this.height < 0 ? this.position.y - this.height : this.position.y;

        const extentX = this.width < 0 ? this.position.x : this.position.x + this.width;
        const extentY = this.height < 0 ? this.position.y : this.position.y + this.height;

        if (point.x >= x && point.x <= extentX && point.y >= y && point.y <= extentY) {
            return true;
        }

        return false;
    }

    /**
     * check if mouse is hovering overshape
     * @param {Vector2} mousePos
     * @return {Vector2}
     */
    public isMouseHovering(mousePos: Vector2): boolean {
        const a = this.getExtents(this);
        return a.position.x <= mousePos.x && a.width >= mousePos.x && a.position.y <= mousePos.y && a.height >= mousePos.y;
    }

    /**
     * get shape extents
     * @param {Rectangle2D} shape
     * @return {Rectangle2D}
     */
    private getExtents(shape: Rectangle2D): Rectangle2D {
        const x = shape.width < 0 ? shape.position.x - shape.width : shape.position.x;
        const y = shape.height < 0 ? shape.position.y - shape.height : shape.position.y;

        const extentX = shape.width < 0 ? shape.position.x : shape.position.x + shape.width;
        const extentY = shape.height < 0 ? shape.position.y : shape.position.y + shape.height;

        return new Rectangle2D(x, y, extentX, extentY);
    }
}
