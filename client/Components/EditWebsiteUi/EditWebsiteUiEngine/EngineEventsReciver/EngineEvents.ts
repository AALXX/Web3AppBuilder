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
        MaterialManager.changeMaterial(data.name, { r: data.r, g: data.g, b: data.b, a: 255 });
    }

    /**
     * change mat color
     * @param {any} data
     */
    private changeMaterialTexture(data: any): void {
        console.log(data);
        MaterialManager.changeMaterial(data.name, null, data.newTexture);
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
            case 'changeMatTexture':
                window.addEventListener('changeMatTexture', (e: any) => {
                    this.changeMaterialTexture(e.detail);
                });
                break;

            default:
                break;
        }
        /* eslint-enable */
    }
}
