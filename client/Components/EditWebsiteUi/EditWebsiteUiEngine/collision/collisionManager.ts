import { CollisionComponent } from '../Components/collisionComponent';

/**
 * CollisionData class
 */
class CollisionData {
    public a: CollisionComponent;
    public b: CollisionComponent;
    public time: number;

    /**
     * class constructor
     * @param {number} time
     * @param {CollisionComponent} a
     * @param {CollisionComponent} b
     */
    public constructor(time: number, a: CollisionComponent, b: CollisionComponent) {
        this.time = time;
        this.a = a;
        this.b = b;
    }
}

/**
 * CollisionManager
 */
export class CollisionManager {
    private static _totalTime: number = 0;
    private static _components: CollisionComponent[] = [];

    private static _collisionData: CollisionData[] = [];

    /**
     * class constructor
     */
    private constructor() {}

    /**
     * register collision component
     * @param {CollisionComponent} component
     */
    public static registerCollisionComponent(component: CollisionComponent): void {
        CollisionManager._components.push(component);
    }

    /**
     * unregister collision component
     * @param {CollisionComponent} component
     */
    public static unRegisterCollisionComponent(component: CollisionComponent): void {
        const index = CollisionManager._components.indexOf(component);
        if (index !== -1) {
            CollisionManager._components.slice(index, 1);
        }
    }

    /**
     * clear components
     */
    public static clear(): void {
        CollisionManager._components.length = 0;
    }

    /**
     * ipdate method
     * @param {number} time
     */
    public static update(time: number): void {
        CollisionManager._totalTime += time;

        for (let c = 0; c < CollisionManager._components.length; ++c) {
            const comp = CollisionManager._components[c];
            for (let o = 0; o < CollisionManager._components.length; ++o) {
                const other = CollisionManager._components[o];

                // Do not check against collisions with self.
                if (comp === other) {
                    continue;
                }

                if (comp.shape.intersects(other.shape)) {
                    // We have a collision!
                    let exists: boolean = false;
                    for (let d = 0; d < CollisionManager._collisionData.length; ++d) {
                        const data = CollisionManager._collisionData[d];

                        if ((data.a === comp && data.b === other) || (data.a === other && data.b === comp)) {
                            // We have existing data. Update it.
                            comp.onCollisionUpdate(other);
                            other.onCollisionUpdate(comp);
                            data.time = CollisionManager._totalTime;
                            exists = true;
                            break;
                        }
                    }

                    if (!exists) {
                        // Create a new collision.
                        const col = new CollisionData(CollisionManager._totalTime, comp, other);
                        comp.onCollisionEntry(other);
                        other.onCollisionEntry(comp);
                        this._collisionData.push(col);
                    }
                }
            }
        }

        // Remove stale collision data.
        const removeData: CollisionData[] = [];
        for (let d = 0; d < CollisionManager._collisionData.length; ++d) {
            const data = CollisionManager._collisionData[d];
            if (data.time !== CollisionManager._totalTime) {
                // Old collision data.
                removeData.push(data);
            }
        }

        while (removeData.length !== 0) {
            const data = removeData.shift();
            const index = CollisionManager._collisionData.indexOf(data);
            CollisionManager._collisionData.splice(index, 1);

            data.a.onCollisionExit(data.b);
            data.b.onCollisionExit(data.a);
        }
    }
}
