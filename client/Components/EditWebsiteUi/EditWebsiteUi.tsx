import React, { useEffect, forwardRef } from 'react';
import { Editor } from './Editor';
import { UiDesignEngine } from './EditWebsiteUiEngine/Engine';
// import styles from './style/EditWebsite.module.css';

const GraphicsCanvas = forwardRef<HTMLCanvasElement>(function Link(prosp:any, ref:any) {
    return (<canvas id="editorArea" ref={ref} width={prosp.Width}/>);
});

/**
 * This Is Editing Website Ui Space
 * @return {JSX.Element}
*/
export default function EditWebsiteUi() {
    const engine = new UiDesignEngine.Engine(1920, 1080);
    const CanvasRef = React.createRef<HTMLCanvasElement >();

    useEffect(() => {
        engine.start(new Editor(), CanvasRef);

        window.onresize = () =>{
            engine.resize();
        };
    }, []);

    return (
        <div>
            <GraphicsCanvas ref={CanvasRef} />
        </div>
    );
}
