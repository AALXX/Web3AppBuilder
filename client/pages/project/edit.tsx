import React, { FC } from 'react';
import styles from '../../styles/EditWebsite.module.css';
import EditWebsiteUi from '../../Components/EditWebsiteUi/EditWebsiteUi';

interface EditProjectProps{

}

/**
 * This Is Editing Website Ui Space
 * @return {JSX.Element}
*/
const EditProject:FC<EditProjectProps> = () => {
    return (
        <div className={styles.PageContainer}>
            <div className={styles.PagesTab}>

            </div>

            <div className={styles.PageEditorContainer}>


                <EditWebsiteUi />

            </div>


            <div className={styles.ComponentsProprietyTab}>

            </div>
        </div>
    );
};

export default EditProject;
