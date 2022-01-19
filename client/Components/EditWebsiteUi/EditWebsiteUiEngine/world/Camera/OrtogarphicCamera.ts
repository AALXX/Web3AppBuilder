import { SceneGraph } from '../SceneGraph';
import { BaseCamera } from './BaseCamera';

/**
 * ortographic camera  class
 */
export class OrtogarphicCamera extends BaseCamera {
    /**
     * class constructor
     * @param {string} name
     * @param {SceneGraph} sceneGraph
     */
    public constructor(name: string, sceneGraph?: SceneGraph) {
        super(name, sceneGraph);
    }
}
