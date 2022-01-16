import { Shaders } from '../../GL/Shaders';
import { SimObject } from '../../world/simObject';

export interface IComponent {
    name: string;

    readonly owner: SimObject;
    setOwner(owner: SimObject): void;

    load(): void;

    update(time: number): void;

    render(shader: Shaders): void;
}
