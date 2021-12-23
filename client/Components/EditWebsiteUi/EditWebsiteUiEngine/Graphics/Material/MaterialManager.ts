import { Material } from './Material';

/**
 * MaterialReferenceNode Class
 */
class MaterialReferenceNode {
    public material: Material;

    public referenceCount: number = 1;

    /**
     *  Class Constructor
     * @param {Material} material
     */
    public constructor(material: Material) {
        this.material = material;
    }
}

/**
 * Material Manager Classs
 */
export class MaterialManager {
    public static _materials: { [name: string]: MaterialReferenceNode } = {};

    /**
     * Class constructor
     */
    private constructor() {

    }

    /**
     *
     * @param {Material} material
     */
    public static registerMaterial(material: Material): void {
        if (MaterialManager._materials[material.name] === undefined) {
            MaterialManager._materials[material.name] = new MaterialReferenceNode(material);
        }
    }

    /** Get Material Method
     * @param {string} materialName
     * @return {Material}
     */
    public static getMaterial(materialName: string): Material {
        if (MaterialManager._materials[materialName] === undefined) {
            return undefined;
        } else {
            MaterialManager._materials[materialName].referenceCount++;
            return MaterialManager._materials[materialName].material;
        }
    }

    /**
     *  Realeases the material
     * @param {string} materialName
     */
    public static releaseMaterial(materialName: string): void {
        if (MaterialManager._materials[materialName] === undefined) {
            console.warn(`cannot release a material that is not registred`);
        } else {
            MaterialManager._materials[materialName].referenceCount--;
            if (MaterialManager._materials[materialName].referenceCount < 1) {
                MaterialManager._materials[materialName].material.destroy();
                MaterialManager._materials[materialName].material = undefined;
            }
        }
    }
}
