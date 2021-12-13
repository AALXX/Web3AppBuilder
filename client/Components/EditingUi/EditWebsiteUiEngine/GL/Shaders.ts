import { gl } from './GLUtilities';
/**
 * Repersents a wegGl shader
 */
export class Shaders {
    private _name: string;
    private _program: WebGLProgram;

    /**
     * Class Constructor
     * @param {string} name
     * @param {string} vertexSource
     * @param {string} fragmentSource
     */
    public constructor(name: string, vertexSource: string, fragmentSource: string) {
        this._name = name;
        const vertxShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);
        this.createProgram(vertxShader, fragmentShader);
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
     * It Loads The Shader
     * @param {string} source
     * @param {number} shaderType
     * @return {WebGLShader}
     */
    private loadShader(source: string, shaderType: number): WebGLShader {
        const shader: WebGLShader = gl.createShader(shaderType);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const error = gl.getShaderInfoLog(shader);
        if (error !== '') {
            throw new Error(`Error compiling shader "${this._name}" : ${error}`);
        }
        return shader;
    }

    /**
     * Return compiled shaders
     * @param {WebGLShader} vertexShader
     * @param {WebGLShader} fragmentShader
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
}
