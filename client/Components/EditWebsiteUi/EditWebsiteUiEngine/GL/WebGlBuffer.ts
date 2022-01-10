import { gl } from './GLUtilities';

/**
 * the information needed for WebGlBuffer
 */
export class AttributeInfo {
    //* location of the attribute
    public location: number;

    //* the size (numb of elemets) in the atribute
    public size: number;

    //* The number of elements from the begnening of the buffer
    public offset: number = 0;
}

/**
 * WebGL Buffer
 */
export class WebGlBuffer {
    private _hasAttributeLocation: boolean = false;
    private _elementSize: number;
    private _stide: number;
    private _buffer: WebGLBuffer;

    private _targetBufferType: number;
    private _dataType: number;
    private _drawingMode: number;
    private _typeSize: number;

    private _data: number[] = [];
    private _attributes: AttributeInfo[] = [];

    /**
     * Create a new WebGl Buffer
     * @param {number} dataType
     * @param {number} targetBufferType
     * @param {number} drawingMode
     */
    public constructor(dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, drawingMode: number = gl.TRIANGLES) {
        this._elementSize = 0;
        this._dataType = dataType;
        this._targetBufferType = targetBufferType;
        this._drawingMode = drawingMode;

        //* Determine byte size
        /* eslint-disable */
        switch (this._dataType) {
            case gl.FLOAT:
            case gl.INT:
            case gl.UNSIGNED_INT:
                this._typeSize = 4;
                break;
            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                this._typeSize = 2;
                break;
            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                this._typeSize = 1;
                break;
            default:
                throw new Error(`Unrecognized dataType: ${dataType.toString()}`);
        }
        /* eslint-enable */

        this._buffer = gl.createBuffer();
    }

    //* Destroys the buffer
    public destroy = (): void => {
        gl.deleteBuffer(this._buffer);
    };

    //* Bindes the buffer
    public bind = (normalized: boolean = false): void => {
        gl.bindBuffer(this._targetBufferType, this._buffer);
        if (this._hasAttributeLocation) {
            for (const it of this._attributes) {
                gl.vertexAttribPointer(it.location, it.size, this._dataType, normalized, this._stide, it.offset * this._typeSize);
                gl.enableVertexAttribArray(it.location);
            }
        }
    };

    //* unBindes The buffer
    public unBind = (): void => {
        for (const it of this._attributes) {
            gl.disableVertexAttribArray(it.location);
        }

        gl.bindBuffer(this._targetBufferType, this._buffer);
    };

    //* Adds an atribute with given info to buffer
    public addAttributeLocation = (info: AttributeInfo): void => {
        this._hasAttributeLocation = true;
        info.offset = this._elementSize;
        this._attributes.push(info);
        this._elementSize += info.size;
        this._stide = this._elementSize * this._typeSize;
    };

    //* Add data to this buffer
    public pushBackData = (data: number[]): void => {
        for (const d of data) {
            this._data.push(d);
        }
    };

    //* Upload buffer data to gpu
    public upload = (): void => {
        gl.bindBuffer(this._targetBufferType, this._buffer);

        let bufferData: ArrayBuffer;

        /* eslint-disable */
        switch (this._dataType) {
            case gl.FLOAT:
                bufferData = new Float32Array(this._data);
                break;
            case gl.INT:
                bufferData = new Int32Array(this._data);
                break;
            case gl.UNSIGNED_INT:
                bufferData = new Uint32Array(this._data);
                break;
            case gl.SHORT:
                bufferData = new Int16Array(this._data);
                break;
            case gl.UNSIGNED_SHORT:
                bufferData = new Uint16Array(this._data);
                break;
            case gl.BYTE:
                bufferData = new Int8Array(this._data);
                break;
            case gl.UNSIGNED_BYTE:
                bufferData = new Uint8Array(this._data);
                break;
        }
        /* eslint-enable */

        gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
    };

    //* Draw this buffer
    public draw = (): void => {
        if (this._targetBufferType === gl.ARRAY_BUFFER) {
            gl.drawArrays(this._drawingMode, 0, this._data.length / this._elementSize);
        } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
            gl.drawElements(this._drawingMode, this._data.length, this._dataType, 0);
        }
    };
}
