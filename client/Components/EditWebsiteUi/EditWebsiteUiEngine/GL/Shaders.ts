import { Color } from '../Graphics/Material/Color';
import { Material } from '../Graphics/Material/Material';
import { ShaderManager } from '../Graphics/ShaderManager';
import { Matrix4x4 } from '../Math/Matrix4x4';
import { gl } from './GLUtilities';

export enum BuiltinShader {
    BASIC = 'basic',
}

/**
 * Represents a WebGL Shaders.
 * */
export abstract class Shaders {
    private _name: string;
    private _program: WebGLProgram;
    private _attributes: { [name: string]: number } = {};
    private _uniforms: { [name: string]: WebGLUniformLocation } = {};

    /**
     * Creates a new Shaders.
     * @param {string} name The name of this Shaders.
     */
    public constructor(name: string) {
        this._name = name;
    }

    /**
     * Destroys this Shaders.
     */
    public destroy(): void {}

    /**
     * The name of this Shaders.
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Use this Shaders.
     * */
    public use(): void {
        if (ShaderManager.ActiveShader !== this) {
            gl.useProgram(this._program);
            ShaderManager.ActiveShader = this;
        }
    }

    /**
     * get Matrix4x4 uniform
     * @param {string} uniformName
     * @param {Matrifx4x4} matrix
     */
    public setUniformMatrix4x4(uniformName: string, matrix: Matrix4x4): void {
        if (this._uniforms[uniformName] === undefined) {
            console.warn(`Unable to find uniform named '${uniformName}' in Shaders named '${this._name}'`);
            return;
        }

        const position = this.getUniformLocation(uniformName);
        gl.uniformMatrix4fv(position, false, matrix.toFloat32Array());
    }

    /**
     * set unifrom color
     * @param {string} uniformName
     * @param {Color} color
     */
    public setUniformColor(uniformName: string, color: Color): void {
        if (this._uniforms[uniformName] === undefined) {
            console.warn(`Unable to find uniform named '${uniformName}' in shader named '${this._name}'`);
            return;
        }

        const position = this.getUniformLocation(uniformName);
        gl.uniform4fv(position, color.toFloat32Array());
    }

    /**
     * set unifrom int
     * @param {string} uniformName
     * @param {nubmer} value
     */
    public setUniformInt(uniformName: string, value: number): void {
        if (this._uniforms[uniformName] === undefined) {
            console.warn(`Unable to find uniform named '${uniformName}' in shader named '${this._name}'`);
            return;
        }

        const position = this.getUniformLocation(uniformName);
        gl.uniform1i(position, value);
    }

    /**
     * Gets the location of an attribute with the provided name.
     * @param {string} name The name of the attribute whose location to retrieve.
     * @return {number}
     */
    public getAttributeLocation(name: string): number {
        if (this._attributes[name] === undefined) {
            throw new Error(`Unable to find attribute named '${name}' in shader named '${this._name}'`);
        }

        return this._attributes[name];
    }

    /**
     * Gets the location of an uniform with the provided name.
     * @param {string} name The name of the uniform whose location to retrieve.F
     *@return {WebGLUniformLocation}
     */
    public getUniformLocation(name: string): WebGLUniformLocation {
        if (this._uniforms[name] === undefined) {
            throw new Error(`Unable to find uniform named '${name}' in shader named '${this._name}'`);
        }

        return this._uniforms[name];
    }

    /**
     * Applies standard uniforms to this Shaders.
     */
    public abstract applyStandardUniforms(material: Material, model: Matrix4x4, view: Matrix4x4, projection: Matrix4x4): void;

    /**
     * Loads this Shaders.
     * @param {string} vertexSource The vertex source.
     * @param {string} fragmentSource The fragment source.
     */
    protected load(vertexSource: string, fragmentSource: string): void {
        const vertexShader = this.loadShaders(vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = this.loadShaders(fragmentSource, gl.FRAGMENT_SHADER);

        this.createProgram(vertexShader, fragmentShader);

        this.detectAttributes();
        this.detectUniforms();
    }

    /**
     * load shaders
     * @param {string} source
     * @param {number} shaderType
     * @return {WebGLShader}
     */
    private loadShaders(source: string, shaderType: number): WebGLShader {
        const shader: WebGLShader = gl.createShader(shaderType);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const error = gl.getShaderInfoLog(shader).trim();
        if (error !== '') {
            throw new Error(`Error compiling Shaders: "${this._name}"': "${error}"`);
        }

        return shader;
    }

    /**
     * create shader program
     * @param {WebGLShader} vertexShader
     * @param {WebGLShader} fragmentShader
     */
    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        this._program = gl.createProgram();

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);

        const error = gl.getProgramInfoLog(this._program).trim();
        if (error !== '') {
            throw new Error(`Error linking Shaders "${this._name}":  "${error}"`);
        }
    }

    /**
     * detect attributes
     */
    private detectAttributes(): void {
        const attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; ++i) {
            const info: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
            if (!info) {
                break;
            }

            this._attributes[info.name] = gl.getAttribLocation(this._program, info.name);
        }
    }

    /**
     * detect attributes
     */
    private detectUniforms(): void {
        const uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; ++i) {
            const info: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
            if (!info) {
                break;
            }

            this._uniforms[info.name] = gl.getUniformLocation(this._program, info.name);
        }
    }
}
