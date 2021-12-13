import { gl } from './GLUtilities';
/**
 * Repersents a wegGl shader
 */
export class Shaders {
    private _name: string;
    private _program: WebGLProgram;
    private _attributes: { [name: string]: number } = {};
    private _uniforms: { [name: string]: WebGLUniformLocation } = {};


    /**
     * Class Constructor
     * @param {string} name
     * @param {string} vertexSource
     * @param {string} fragmentSource
     */
    public constructor(name: string, vertexSource: string, fragmentSource: string) {
        this._name = name;
        const VertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        const FragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

        this.createProgram(VertexShader, FragmentShader);
        this.detectAttributes();
        this.detectUniforms();
    }

    /**
     * Get Name Method
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Use Shader
     */
    public useShader(): void {
        gl.useProgram(this._program);
    }

    /**
     * Get atribute location with given name
     * @param {string} name
     * @return {number}
     */
    public getAtributeLocation = (name: string): number => {
        if (this._attributes[name] === undefined) {
            throw new Error(`Unable to find atribute name "${name}" in shader: "${this.name}"`);
        }
        return this._attributes[name];
    };

    //* Get uniform location with given name
    public getUniformLocation = (name: string): WebGLUniformLocation => {
        if (this._uniforms[name] === undefined) {
            throw new Error(`Unable to find uniform name "${name}" in shader: "${this.name}"`);
        }

        return this._uniforms[name];
    };

    /**
     * It Loads The Shader
     * @param {string} source
     * @param {number} shaderType
     * @return {glShader}
     */
    private loadShader(source: string, shaderType: number): WebGLShader {
        const shader: WebGLShader = gl.createShader(shaderType);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const error = gl.getShaderInfoLog(shader);

        if (error !== '') {
            throw new Error(`ERROR compiling shader ${this._name}  : ${error}`);
        }


        return shader;
    }

    /**
     * Return compiled shaders
     * @param {glShader} vertexShader
     * @param {glShader} fragmentShader
     */
    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        this._program = gl.createProgram();

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);

        const error = gl.getProgramInfoLog(this._program);
        if (error !== '') {
            throw new Error(`Error linking shader "${this._name}" : ${error}`);
        }
    }

    //* Gets the location of Attributes
    private detectAttributes = (): void => {
        const atributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < atributeCount; i++) {
            const atributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
            if (!atributeInfo) {
                break;
            }
            this._attributes[atributeInfo.name] = gl.getAttribLocation(this._program, atributeInfo.name);
        }
    };
    //* Go trough shader and get all the names

    private detectUniforms = (): void => {
        const uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const UniformInfo: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
            if (!UniformInfo) {
                break;
            }
            this._uniforms[UniformInfo.name] = gl.getUniformLocation(this._program, UniformInfo.name);
        }
    };
}
