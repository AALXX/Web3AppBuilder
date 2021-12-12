
import { Request, Response, NextFunction } from 'express';
import logging from "../../config/logging";
import { Connect, Query } from "../../config/mysql";
import { CreatePublicToken } from "../../UtilityFunctions/TokenCreator"
const path = require('path');

const NAMESPACE = 'WebDesignToolServ';

const ServDesignTool = (req:Request, res:Response) => {

}

export default {
    ServDesignTool
}