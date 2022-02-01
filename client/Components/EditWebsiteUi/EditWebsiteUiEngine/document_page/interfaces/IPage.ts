import { RenderView } from '../../Renderer/RenderView';
import { EditorEntity } from '../../world/EditorEntity';

export interface IPage {
    /** The name of this page */
    name: string;

    /**
     * Sets the owner of this page.
     * @param owner The owner.
     */
    setOwner(page: EditorEntity): void;

    /**
     * load page config
     */
    load(): void;

    /**
     * Performs update procedures on this page
     * @param time The delta time in milliseconds since the last update.
     */
    update(time: number): void;

    render(renderView: RenderView): void;
}
