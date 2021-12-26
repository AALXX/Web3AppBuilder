import express from 'express';

import WebDesignToolServ from '../../Services/ServeProjectFileDataManager/ServeProjectFileDataManager';

import { param, body } from 'express-validator';

const router = express.Router();

router.get(
    '/get-project/:projectToken',
    param('projectToken'),
    WebDesignToolServ.ServeJsonProject,
);

router.post(
    '/add-project/',
    body('ProjectName').not().isEmpty().trim(),
    WebDesignToolServ.AddProject,
);

export = router;
