import express from 'express';

import WebDesignToolServ from '../../Services/ServeProjectFileDataManager/ServeProjectFileDataManager';

import { param, body } from 'express-validator';

const router = express.Router();

router.get('/get-project-propieties/:projectName', param('projectName'), WebDesignToolServ.GetProjectProprieties);

router.get('/get-project-json-data/:projectToken/:projectName', param('projectName'), param('projectToken'), WebDesignToolServ.GetProjectData);

router.post('/add-project/', body('ProjectName').not().isEmpty().trim(), WebDesignToolServ.AddProject);

//* design tool assets
router.post('/upload-texture/', WebDesignToolServ.UploadTextureFileToServer);

export = router;
