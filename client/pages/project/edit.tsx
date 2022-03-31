import React, { FC, useEffect, useState } from 'react';
import styles from '../../styles/EditWebsite.module.css';
import EditWebsiteUi from '../../Components/EditWebsiteUi/EditWebsiteUi';

interface EditProjectProps{

}

interface SpriteComponentContenProps {
    width: number,
    height: number,
    SpriteData:any
}

interface ObjectPanelProps
{
    Component:any,
}

const SpriteComponentContent:FC<SpriteComponentContenProps> = (props) =>{
    const [color, setColor] = useState('#E60250');

    const rgbToHex = (r:number, g:number, b:number) => {
        return '#' + [r, g, b].map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    const hexToRgb = (hex:string) =>{
        hex = hex.replace('#', '');
        const aRgbHex = hex.match(/.{1,2}/g);

        const r = parseInt(aRgbHex[0], 16);
        const g = parseInt(aRgbHex[1], 16);
        const b = parseInt(aRgbHex[2], 16);


        return {
            red: r,
            green: g,
            blue: b,
        };
    };

    useEffect(() => {
        setColor(rgbToHex(props.SpriteData._material._tint._r, props.SpriteData._material._tint._g, props.SpriteData._material._tint._b));
    }, []);

    const changeColor = (colorString:string) => {
        const event: CustomEvent = new CustomEvent('changeMatColor', {
            detail: {
                name: props.SpriteData._material._name,
                r: hexToRgb(colorString).red,
                g: hexToRgb(colorString).green,
                b: hexToRgb(colorString).blue,
            },
        });

        setColor(colorString);
        window.dispatchEvent(event);
    };

    return (
        <div>
            <h1 className='text-white ml-2'>width:  {props.width}</h1>
            <h1 className='text-white ml-2'>height: {props.height}</h1>
            <h1 className='text-white mt-2 ml-2'>material: </h1>
            {/* <img src={props.SpriteData._material._diffuseTextureName} /> */}
            <input type="color" onChange={(e) => {
                changeColor(e.target.value);
            }} value={color}/>
        </div>
    );
};

//* Left panel inspect components of selected object proprieies
const ObjectComponentsPanel:FC<ObjectPanelProps> = (props) => {
    const [type, setType] = useState('');

    useEffect(()=>{
        setType(props.Component. _data.type);
    }, []);

    const renderSwitch = (type:string) => {
        switch (type) {
        case 'sprite':
            return <SpriteComponentContent width={props.Component._data.width} height={props.Component._data.height} SpriteData={props.Component._sprite}/>;
        default:
            return 'Not Supported Yet';
        }
    };

    return (
        <div className='flex flex-col w-full border-2 bg-components-gray mt-2 h-40 overflow-y-scroll '>
            <h1 className=' text-white self-center'>{props.Component. _data.type}</h1>
            <hr className='w-full mt-1 '/>
            {renderSwitch(type)}

        </div>
    );
};

//* Left panel inspect selected object proprieies
const LeftInspectObjectPanel:FC<EditProjectProps> = () => {
    const [objectName, setObjectName] = useState('');
    const [objectPosition, setObjectPosition] = useState({ x: 0, y: 0, z: 0 });


    const [ComponentsList, setComponentsList] = useState([]);

    //* get object data from engine and set it to frontend
    const SetDataFromEngine = (e:any) =>{
        setObjectName(e.detail.name);


        //* scuffed af made for force state change
        setObjectPosition({ x: 0, y: 0, z: 0 });


        setObjectPosition(e.detail.transform.position);


        setComponentsList(e.detail.components);
    };

    useEffect(() =>{
        window.addEventListener('selectObject', SetDataFromEngine);

        // cleanup this component
        return () => {
            window.removeEventListener('selectObject', SetDataFromEngine);
        };
    }, []);


    return (
        <div className='flex w-80 bg-grey-default flex-col'>
            <h1 className= 'text-white self-center mt-4 '>Name: {objectName}</h1>
            <div className='flex flex-col w-auto h-30  mt-2'>
                <h1 className='text-white bg-darker-gray'>Transform:</h1>
                <h1 className='ml-4 text-white'>x: {objectPosition.x}</h1>
                <h1 className='ml-4 text-white'>y: {objectPosition.y}</h1>
                <h1 className='ml-4 text-white'>z: {objectPosition.z}</h1>
            </div>

            <h1 className= 'text-white self-center w-full mt-4 bg-darker-gray'>Components:</h1>
            <div className='flex flex-col w-full h-30 mt-2 '>
                {ComponentsList.map((Component, index) => (
                    <div key={index} >
                        <ObjectComponentsPanel
                            Component = {Component}
                        />
                    </div>
                ))}
            </div>

            <h1 className= 'text-white self-center w-full mt-4 bg-darker-gray'>Behaviours:</h1>

            <button onClick={() =>{
            }}>Create Object</button>

        </div>
    );
};

/**
 * This Is Editing Website Ui Space
 * @return {JSX.Element}
*/
const EditProject:FC<EditProjectProps> = () => {
    return (
        <div className={styles.PageContainer}>
            <LeftInspectObjectPanel />

            <div className={styles.PageEditorContainer}>
                <EditWebsiteUi />
            </div>

            <div className={styles.ComponentsProprietyTab}>

            </div>
        </div>
    );
};

export default EditProject;
