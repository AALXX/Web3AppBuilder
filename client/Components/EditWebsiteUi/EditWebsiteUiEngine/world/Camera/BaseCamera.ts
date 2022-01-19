import { Matrix4x4 } from '../../Math/Matrix4x4';
import { EditorEntity } from '../EditorEntity';
import { SceneGraph } from '../SceneGraph';

/**
 * The base class from which all cameras should inherit.
 */
export abstract class BaseCamera extends EditorEntity {
    /**
     * Creates a new camera.
     * @param {string} name The name of this camera.
     * @param {SceneGraph} sceneGraph The scene graph to be used with this camera.
     */
    public constructor(name: string, sceneGraph?: SceneGraph) {
        super(name, sceneGraph);
    }

    /** Returns the view for this camera. */
    public get view(): Matrix4x4 {
        return this.transform.getTransformationMatrix();
    }
}
