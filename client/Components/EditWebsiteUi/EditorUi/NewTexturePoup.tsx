import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';

interface NewTexturePoupProps {
    closePopup:any,
    allMaterials:Array<object>
    projectName:string,
    projectToken:string,
}

const NewTexturePoup: FC<NewTexturePoupProps> = (props) => {
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [materials, setmaterials] = useState([]);

    //* texture attrb states
    const [textureName, setTextureName] = useState('');

    //* texture object states
    const [textureFile, setTextureFile] = useState(null);
    const [ObjectUrl, setObjectUrl] = useState(null);

    //* Upload Progress State
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setmaterials(props.allMaterials);
    }, []);

    //* Creates a Url for preview texture
    const previewTexture = (e:any) => {
        e.preventDefault();
        setObjectUrl(URL.createObjectURL(e.target.files[0]));
    };


    //* Uploads Video to server
    const UploadFile = () => {
        if (textureFile[0] == null) {
            return window.alert('No Video file inputed');
        }

        const formData = new FormData();
        formData.append('file', textureFile[0]);
        formData.append('TextureName', textureName);
        formData.append('ProjectToken', props.projectToken);

        console.log(props.projectToken);

        const config = {
            header: { 'content-type': 'multipart/formdata' },
            onUploadProgress: (progressEvent:ProgressEvent) => {
                let percent = 0;
                const { loaded, total } = progressEvent;
                percent = Math.floor((loaded * 100) / total); //* set percent
                if (percent <= 100) {
                    setProgress(percent);
                }
            },
        };

        // axios.post(`${process.env.SERVER_BACKEND}/design-tool-manager/upload-texture`, formData, config).then((res) => {
        //     console.log(res.data);
        // });
    };

    return (
        <div className='fixed w-full h-full top-0 left-0 bottom-0 right-0 m-auto z-10 bg-transparent-dark'>
            <div className='flex flex-col absolute z-10 left-1/4 right-1/4 top-1/4 bottom-1/4 w-34rem h-44rem m-auto bg-grey-default'>
                <button onClick={props.closePopup}>&#9587;</button>
                <div>
                    <div>
                        <h1>all textures</h1>
                        <div className='flex flex-row mt-1'>
                            <h1>Texure</h1>
                            <select className='h-6 self-center bg-select-grey text-white border-0 w-full' name="materialTextureSelector"
                                onChange={(e) => setSelectedMaterial(e.target.value)}>
                                {materials.map((material, index) => (
                                    <option key={index} value={material.diffuse}>{material.diffuse}</option>
                                ))}
                            </select>
                        </div>
                        <img className='w-20 h-20' src={selectedMaterial} />
                    </div>
                    <hr color="#7c7c7c" className='mt-4'/>
                    <div className='mt-4'>
                        <h1>upload texture</h1>
                        <div>
                            <label htmlFor="VideoFile" className='flex border-2 border-border-grey w-80 h-40 ml-10 cursor-pointer'>
                                <input className='hidden' type="file" id="VideoFile" onChange={(e) => {
                                    setTextureFile(e.target.files); previewTexture(e); setProgress(0);
                                }} accept=".png, .jpg" />
                                <img src='/assets/UploadTexture/FileUploadIcon.svg' alt='AccountImageButton' className='m-auto w-28 h-8' />
                            </label>

                            <h1>TextureName:{props.projectName}</h1>
                            <input type="text" value={textureName} placeholder="name..." className='bg-select-grey border-0 w-80 text-white mt-2' onChange={(e) => {
                                setTextureName(e.target.value);
                            }} />
                        </div>
                        <div className='flex flex-col items-center'>
                            <h1 className='mr-auto'>Preview:</h1>
                            <img className='w-28 h-28 mr-auto ml-10' src={ObjectUrl} />
                            <button onClick={UploadFile}>Upload texture</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NewTexturePoup;
