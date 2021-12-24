import express from 'express';

import WebDesignToolServ from '../../Services/ServeProjectFileDataManager/ServeProjectFileDataManager';

const router = express.Router();

router.get('/get-project/:token', WebDesignToolServ.ServeJsonProject);

export = router;
