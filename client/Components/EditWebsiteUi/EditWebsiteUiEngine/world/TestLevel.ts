import { SpriteComponent } from '../Components/spriteComponent';
import { Level } from './Level';
import { SimObject } from './SimObject';

/**
 * Test Level
 */
export class TestLevel extends Level {
    private _parentObject: SimObject;
    private _parentSprite: SpriteComponent;

    private _testObject: SimObject;
    private _testSprite: SpriteComponent;

    /**
     * Load
     */
    public load(): void {
        this._parentObject = new SimObject(0, 'parentObject');
        this._parentObject.transform.position.x = 300;
        this._parentObject.transform.position.y = 300;
        this._parentSprite = new SpriteComponent('test', 'wood');
        this._parentObject.addComponent(this._parentSprite);

        this._testObject = new SimObject(1, 'testObject');
        this._testSprite = new SpriteComponent('test', 'wood');
        this._testObject.addComponent(this._testSprite);

        this._testObject.transform.position.x = 120;
        this._testObject.transform.position.y = 120;

        this._parentObject.addChild(this._testObject);

        this.scene.addObject(this._parentObject);

        super.load();
    }

    /**
     * Update
     * @param {number} time
     */
    public update(time: number): void {
        this._parentObject.transform.rotation.z += 0.01;


        super.update(time);
    }
}
