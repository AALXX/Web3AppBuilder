import { EditorEntity } from './EditorEntity';
import { Shaders } from '../GL/Shaders';

/**
 * Scene class
 */
export class Scene {
    private _root: EditorEntity;

    public constructor() {
        this._root = new EditorEntity(0, '__ROOT__', this);
    }

    public get root(): EditorEntity {
        return this._root;
    }

    public get isLoaded(): boolean {
        return this._root.isLoaded;
    }

    public addObject(object: EditorEntity): void {
        this._root.addChild(object);
    }

    public getObjectByName(name: string): EditorEntity {
        return this._root.getObjectByName(name);
    }

    public load(): void {
        this._root.load();
    }

    public update(time: number): void {
        this._root.update(time);
    }

    public render(shader: Shaders): void {
        this._root.render(shader);
    }
}
