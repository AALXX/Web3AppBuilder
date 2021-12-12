import express from "express";

import WebDesignToolServ from "../../Services/WebisteDesignToolDelivermanager/WebisteDesignToolDelivermanager"

const router = express.Router();

router.get("/get-wasm/", WebDesignToolServ.ServDesignTool);


export = router;