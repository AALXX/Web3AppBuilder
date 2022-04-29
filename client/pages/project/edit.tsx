import React, { FC, useContext, useEffect, useState } from 'react';
import styles from '../../styles/EditWebsite.module.css';
import EditWebsiteUi from '../../Components/EditWebsiteUi/EditWebsiteUi';
import axios from 'axios';
import NewTexturePoup from '../../Components/EditWebsiteUi/EditorUi/NewTexturePoup';

export const MaterialContext = React.createContext([]);


interface EditProjectProps{
    projectName:string,
    projectToken:string

}

interface LeftInspectObjectPanelProps{
    projectName:string,

}

interface SpriteComponentContenProps {
    width: number,
    height: number,
    SpriteData:any,
    projectName:string,
    projectToken:string

}

interface ObjectPanelProps
{
    Component:any,
    projectName:string,
    projectToken:string

}

const SpriteComponentContent:FC<SpriteComponentContenProps> = (props) =>{
    const [color, setColor] = useState('');

    const materials = useContext(MaterialContext);
    const [selectedMaterial, setSelectedMaterial] = useState('');

    const [ToggledNewTexturePopUp, setToggledNewTexturePopUp] = useState(false);

    const [prjName, setPrjName] = useState('');
    const [prjToken, setPrjToken] = useState('');

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
        setPrjName(props.projectName);
        setPrjToken(props.projectToken);
    }, []);

    const changeColor = (colorString:string) => {
        const changeColorEvent: CustomEvent = new CustomEvent('changeMatColor', {
            detail: {
                name: props.SpriteData._material._name,
                r: hexToRgb(colorString).red,
                g: hexToRgb(colorString).green,
                b: hexToRgb(colorString).blue,
            },
        });

        setColor(colorString);
        window.dispatchEvent(changeColorEvent);
    };

    const chaneTexture = (texture:string) =>{
        setSelectedMaterial(texture);

        const changeTextureEvent: CustomEvent = new CustomEvent('changeMatTexture', {
            detail: {
                name: props.SpriteData._material._name,
                newTexture: texture,
            },
        });

        window.dispatchEvent(changeTextureEvent);
    };

    return (
        <div>
            <h1 className='text-white ml-2'>width:  {props.width}</h1>
            <h1 className='text-white ml-2'>height: {props.height}</h1>
            <div className='flex flex-row mt-3 '>
                <h1 className='text-white ml-2 self-center'>material: </h1>
                <select className='h-6 self-center bg-select-grey text-white border-0 w-full' name="materialSelector" >
                    {materials.map((material, index) => (
                        <option key={index} value={material.name}>{material.name}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-row mt-2'>
                <h1 className='text-white ml-2 self-center'>color:</h1>
                <input className='ml-2 self-center' type="color" onChange={(e) => {
                    changeColor(e.target.value);
                }} value={color}/>
            </div>

            <div className='flex flex-col mt-2 '>
                <div className='flex flex-row mt-1'>
                    <h1>Texure</h1>
                    <select className='h-6 self-center bg-select-grey text-white border-0 w-full' name="materialTextureSelector"
                        onChange={(e) => chaneTexture(e.target.value)}>
                        {materials.map((material, index) => (
                            <option key={index} value={material.diffuse}>{material.diffuse}</option>
                        ))}
                    </select>
                </div>
                <img className='w-20 h-20' src={selectedMaterial} />
                <button onClick={() =>{
                    setToggledNewTexturePopUp(!ToggledNewTexturePopUp);
                }}>new texture</button>


            </div>
            {ToggledNewTexturePopUp ? (
                <NewTexturePoup closePopup={() => {
                    setToggledNewTexturePopUp(!ToggledNewTexturePopUp);
                }} allMaterials = {materials} projectName = {prjName} projectToken = {prjToken}

                />
            ) : null}
        </div>
    );
};

//* Left panel inspect components of selected object proprieies
const ObjectComponentsPanel:FC<ObjectPanelProps> = (props) => {
    const [type, setType] = useState('');
    const [prjName, setprjName] = useState('');

    useEffect(()=>{
        setType(props.Component. _data.type);
        setprjName(props.projectName);
    }, []);

    const renderSwitch = (type:string) => {
        switch (type) {
        case 'sprite':
            return <SpriteComponentContent width={props.Component._data.width} height={props.Component._data.height} SpriteData={props.Component._sprite}
                projectName={prjName}
                projectToken={props.projectToken}
            />;
        default:
            return 'Not Supported Yet';
        }
    };

    return (
        <div className='flex flex-col w-full border-2 bg-components-gray mt-2 h-60 overflow-y-scroll '>
            <h1 className=' text-white self-center'>{props.Component. _data.type}</h1>
            <hr className='w-full mt-1 '/>
            {renderSwitch(type)}

        </div>
    );
};

//* Left panel inspect selected object proprieies
const LeftInspectObjectPanel:FC<LeftInspectObjectPanelProps> = (props) => {
    const [objectName, setObjectName] = useState('');
    const [objectPosition, setObjectPosition] = useState({ x: 0, y: 0, z: 0 });
    const [materials, setMaterials] = useState();
    const [prjToken, setPrjToken] = useState('');


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
        axios.get('http://localhost:9000/kw8rybzkj4ova9uyj1/assets/Materials/baseMaterials.json').then((res) =>{
            // console.log(res.data.materials);
            setMaterials(res.data.materials);
        }).catch((err) =>{
            console.log(err);
        });


        axios.get(`${process.env.SERVER_BACKEND}/design-tool-manager/get-project-propieties/${props.projectName}`)
            .then((res) => {
                console.warn(res.data);
                if (res.data.error) {
                    return window.alert(`an error has ocured: ${res.data.msg}`);
                }
                setPrjToken(res.data);
                console.error(res.data);
            }).catch((err) =>{
                console.error(err);
            });


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
                        <MaterialContext.Provider value={materials}>
                            <ObjectComponentsPanel
                                Component = {Component}
                                projectName = {props.projectName}
                                projectToken = {prjToken}
                            />
                        </MaterialContext.Provider>
                    </div>
                ))}
            </div>

            <h1 className= 'text-white self-center w-full mt-4 bg-darker-gray'>Behaviours:</h1>

            <button>Create Object</button>

        </div>
    );
};

/**
 * This Is Editing Website Ui Space
 * @param {EditProjectProps} props
 * @return {JSX.Element}
*/
const EditProject:FC<EditProjectProps> = (props) => {
    return (
        <div className={styles.PageContainer}>
            <LeftInspectObjectPanel projectName={props.projectName}/>

            <div className={styles.PageEditorContainer}>
                <EditWebsiteUi />
            </div>

            <div className={styles.ComponentsProprietyTab}>

            </div>

        </div>
    );
};

export default EditProject;


/**
 *  get server side props
 * @param {any} context
 * @return {props}
 */
export async function getServerSideProps(context:any) {
    return {
        props: {
            error: false,
            projectName: context.query.name,
        },
    };
}
