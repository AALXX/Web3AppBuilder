import { RenderView } from '../../Renderer/RenderView';
import { EditorEntity } from '../../world/EditorEntity';

export interface IComponent {
    name: string;

    readonly owner: EditorEntity;
    setOwner(owner: EditorEntity): void;

    updateReady(): void;

    load(): void;

    update(time: number): void;

    render(renderView: RenderView): void;
}
