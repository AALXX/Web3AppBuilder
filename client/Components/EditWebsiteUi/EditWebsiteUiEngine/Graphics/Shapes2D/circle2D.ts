import { Vector2 } from '../../Math/Vector2';
import { IShape2D } from './IShape2D';
import { Rectangle2D } from './rectangle2d';

/**
 * class cirlce2D
 */
export class Circle2D implements IShape2D {
    isMouseHovering(mousePos: Vector2): boolean {
        throw new Error('Method not implemented.');
    }
    public position: Vector2 = Vector2.zero;

    public origin: Vector2 = Vector2.zero;

    public radius: number;

    /**
     * get offset
     */
    public get offset(): Vector2 {
        return new Vector2(this.radius + this.radius * this.origin.x, this.radius + this.radius * this.origin.y);
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

        if (json.radius === undefined) {
            throw new Error('Rectangle2D requires radius to be present.');
        }
        this.radius = Number(json.radius);
    }

    /**
     * check if intersects
     * @param {IShape2D} other
     * @return {boolean}
     */
    public intersects(other: IShape2D): boolean {
        if (other instanceof Circle2D) {
            const distance = Math.abs(Vector2.distance(other.position, this.position));
            const radiusLengths = this.radius + other.radius;
            if (distance <= radiusLengths) {
                return true;
            }
        }

        if (other instanceof Rectangle2D) {
            const deltaX = this.position.x - Math.max(other.position.x, Math.min(this.position.x, other.position.x + other.width));
            const deltaY = this.position.y - Math.max(other.position.y, Math.min(this.position.y, other.position.y + other.height));
            if (deltaX * deltaX + deltaY * deltaY < this.radius * this.radius) {
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
        const absDistance = Math.abs(Vector2.distance(this.position, point));
        if (absDistance <= this.radius) {
            return true;
        }

        return false;
    }
}
