import { MaterialManager } from '../Graphics/Material/MaterialManager';
import { IEditorEvents } from './IEngineEvents';

/**
 *  recives events from front-end
 */
export class EngineEvents implements IEditorEvents {
    /**
     * change mat color
     * @param {any} data
     */
    private changeMaterialColor(data: any): void {
        // console.log(data);

        MaterialManager.changeMaterial(data.name, { r: data.r, g: data.g, b: data.b, a: 255 });

        // const material = MaterialManager.getMaterial('wood');
        // console.log(material);
    }

    /**
     * listenToevents
     * @param {string} eventName
     */
    public listenToEvents(eventName: string): void {
        /* eslint-disable */

        switch (eventName) {
            case 'changeMatColor':
                window.addEventListener('changeMatColor', (e: any) => {
                    this.changeMaterialColor(e.detail);
                });
                break;

            default:
                break;
        }
        /* eslint-enable */
    }
}
