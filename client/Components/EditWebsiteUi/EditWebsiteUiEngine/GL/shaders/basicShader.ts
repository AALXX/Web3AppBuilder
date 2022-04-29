import { Material } from '../../Graphics/Material/Material';
import { Matrix4x4 } from '../../Math/Matrix4x4';
import { BuiltinShader, Shaders } from '../Shaders';

/**
 * A basic shader that can be used for 2D games.
 */
export class BasicShader extends Shaders {
    /**
     * class constructor
     */
    public constructor() {
        super(BuiltinShader.BASIC);

        this.load(this.getVertexSource(), this.getFragmentSource());
    }

    /**
     * apply standard unisform
     * @param {Material} material
     * @param {Matrix4x4} model
     * @param {Matrix4x4} view
     * @param {Matrix4x4} projection
     */
    public applyStandardUniforms(material: Material, model: Matrix4x4, view: Matrix4x4, projection: Matrix4x4): void {
        this.use();
        this.setUniformMatrix4x4('u_model', model);
        this.setUniformMatrix4x4('u_view', view);
        this.setUniformMatrix4x4('u_projection', projection);
        this.setUniformColor('u_tint', material.tint);

        if (material.diffuseTexture !== undefined) {
            material.diffuseTexture.activateAndBind(0);
            this.setUniformInt('u_diffuse', 0);
        }
    }

    /**
     * get vertex source
     * @return {string}
     */
    private getVertexSource(): string {
        return `
attribute vec3 a_position;
attribute vec2 a_texCoord;
uniform mat4 u_view;
uniform mat4 u_model;
uniform mat4 u_projection;
varying vec2 v_texCoord;
varying vec3 v_fragPosition;
void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
    v_fragPosition = vec3(u_model * vec4(a_position, 1.0));
}`;
    }

    /**
     * get fragment source
     * @return {string}
     */
    private getFragmentSource(): string {
        return `
precision mediump float;
uniform vec4 u_tint;
uniform sampler2D u_diffuse;
varying vec2 v_texCoord;
void main() {
    gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
}
`;
    }
}
