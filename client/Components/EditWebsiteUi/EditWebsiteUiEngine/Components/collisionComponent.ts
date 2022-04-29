import { CollisionManager } from '../collision/collisionManager';
import { Circle2D } from '../Graphics/Shapes2D/circle2D';
import { IShape2D } from '../Graphics/Shapes2D/IShape2D';
import { Rectangle2D } from '../Graphics/Shapes2D/rectangle2d';
import { Message } from '../MessageManager/Message';
import { RenderView } from '../Renderer/RenderView';
import { BaseComponent } from './BaseComponent';
import { IComponent } from './interfaces/IComponent';
import { IComponentBuilder } from './interfaces/IComponentBuilder';
import { IComponentData } from './interfaces/IComponentData';

/**
 * collison component data
 */
export class CollisionComponentData implements IComponentData {
    public name: string;
    public type: string;
    public shape: IShape2D;
    public static: boolean = true;

    /**
     * set data from provided json
     * @param {any} json
     */
    public setFromJson(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.type !== undefined) {
            this.type = String(json.type);
        }

        if (json.static !== undefined) {
            this.static = Boolean(json.static);
        }

        if (json.shape === undefined) {
            throw new Error('CollisionComponentData requires shape to be present.');
        } else {
            if (json.shape.type === undefined) {
                throw new Error('CollisionComponentData requires shape.type to be present.');
            }

            const shapeType: string = String(json.shape.type).toLowerCase();
            /* eslint-disable */

            switch (shapeType) {
                case 'rectangle':
                    this.shape = new Rectangle2D();
                    break;
                case 'circle':
                    this.shape = new Circle2D();
                    break;
                default:
                    throw new Error("Unsupported shape type: '" + shapeType + "'.");
            }
            /* eslint-enable */

            this.shape.setFromJson(json.shape);
        }
    }
}

/**
 * collison comopnent build
 */
export class CollisionComponentBuilder implements IComponentBuilder {
    /**
     * get component type
     */
    public get type(): string {
        return 'collision';
    }

    /**
     * build  from provided json
     * @param {any} json
     * @return {IComponent}
     */
    public buildFromJson(json: any): IComponent {
        const data = new CollisionComponentData();
        data.setFromJson(json);
        return new CollisionComponent(data);
    }
}

/**
 * A collision component. Likely to be removed when collision system is replaced.
 */
export class CollisionComponent extends BaseComponent {
    private _shape: IShape2D;
    private _static: boolean;

    /**
     * constructor
     * @param {CollisionComponentData} data
     */
    public constructor(data: CollisionComponentData) {
        super(data);

        this._shape = data.shape;
        this._static = data.static;
    }

    /**
     * get collison shape
     */
    public get shape(): IShape2D {
        return this._shape;
    }

    /**
     * is static
     */
    public get isStatic(): boolean {
        return this._static;
    }

    /**
     * load method
     */
    public load(): void {
        super.load();

        // TODO: need to get world position for nested objects.
        this._shape.position.copyFrom(this.owner.getWorldPosition().toVector2().add(this._shape.offset));

        // Tell the collision manager that we exist.
        CollisionManager.registerCollisionComponent(this);
    }

    /**
     * update
     * @param {number} time
     */
    public update(time: number): void {
        // TODO: need to get world position for nested objects.
        this._shape.position.copyFrom(this.owner.getWorldPosition().toVector2().add(this._shape.offset));
        super.update(time);
    }

    /**
     * render
     * @param {RenderView} renderView
     */
    public render(renderView: RenderView): void {
        // this._sprite.draw( shader, this.owner.worldMatrix );

        super.render(renderView);
    }

    /**
     * on collision entry
     * @param {CollisionComponent} other
     */
    public onCollisionEntry(other: CollisionComponent): void {
        // console.log('onCollisionEntry:', this, other);
    }

    /**
     * on collision update
     * @param {CollisionComponent} other
     */
    public onCollisionUpdate(other: CollisionComponent): void {
        // console.log('onCollisionUpdate:', this, other);
    }

    /**
     * on collision exit
     * @param {CollisionComponent} other
     */
    public onCollisionExit(other: CollisionComponent): void {
        // console.log('onCollisionExit:', this, other);
    }

    /**
     * on hover over object
     */
    public onHover(): void {
        // console.log('onCollisionExit:', this);
        Message.send(`MOUSE_HOVER: ${this.owner.name}`, this);
    }

    /**
     * on hover over object
     */
    public onHoverExit(): void {
        // console.log('onCollisionExit:', this);
        Message.send(`MOUSE_HOVER_EXIT: ${this.owner.name}`, this);
    }
}
