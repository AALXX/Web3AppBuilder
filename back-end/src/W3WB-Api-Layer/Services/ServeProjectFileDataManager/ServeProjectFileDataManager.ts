import { Request, Response } from 'express';
import logging from '../../config/logging';
import { connect, query } from '../../config/mysql';
import { validationResult } from 'express-validator';
import fs from 'fs';

import multer from 'multer';

const NAMESPACE = 'ServerProjectsData';

const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

const AddProject = (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ error: true, errors: errors.array() });
    }
};

const GetProjectProprieties = (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const GetProjectQueryString = `SELECT ProjectToken FROM projects WHERE ProjectName="${req.params.projectName}";`;
    connect()
        .then((connection) => {
            query(connection, GetProjectQueryString)
                .then((results) => {
                    const data = JSON.parse(JSON.stringify(results));

                    //* it checks if data object has values if not it sends back account ecist false
                    if (Object.keys(data).length === 0) {
                        return res.status(200).json({
                            error: true,
                            message: 'project not found',
                        });
                    }

                    return data.ProjectToken;
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);
                    return res.status(500).json({
                        error: true,
                        message: error,
                    });
                })
                .finally(() => {
                    connection.end();
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                error: true,
                message: error,
            });
        });
};

const GetProjectData = (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ error: true, errors: errors.array() });
    }

    fs.stat(`../Projects/${req.params.projectToken}/${req.params.projectName}.json`, (err) => {
        if (err) {
            return res.status(200).json({ error: true, message: err.message });
        }

        //* deepcode ignore PT: <input sanitized in routes file>
        fs.readFile(`../Projects/${req.params.projectToken}/pages.json`, 'utf8', function read(err, pages) {
            if (err) {
                return res.status(200).json({ error: true, message: err.message });
            }

            fs.stat(`../Projects/${req.params.projectToken}/pages.json`, (err) => {
                if (err) {
                    return res.status(200).json({ error: true, message: err.message });
                }

                //* deepcode ignore PT: <input sanitized in routes file>
                fs.readFile(`../Projects/${req.params.projectToken}/${req.params.projectName}.json`, 'utf8', function read(err, pageData) {
                    if (err) {
                        return res.status(200).json({ error: true, message: err.message });
                    }

                    fs.stat(`../Projects/${req.params.projectToken}/assets/Materials/baseMaterials.json`, (err) => {
                        if (err) {
                            return res.status(200).json({ error: true, message: err.message });
                        }

                        //* deepcode ignore PT: <input sanitized in routes file>
                        fs.readFile(`../Projects/${req.params.projectToken}/assets/Materials/baseMaterials.json`, 'utf8', function read(err, materialsData) {
                            if (err) {
                                return res.status(200).json({ error: true, message: err.message });
                            }

                            return res.status(200).json({ error: false, projectPages: JSON.parse(pages), pageData: JSON.parse(pageData), materialsData: JSON.parse(materialsData) });
                        });
                    });
                });
            });
        });
    });
};

const storage = multer.diskStorage({
    destination: (req: Request, file: any, callback: any) => {
        callback(null, '../Projects/tmp');
    },

    filename: (req: Request, file, cb: any) => {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
}).single('file');

const UploadTextureFileToServer = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, 'Posting Video service called');

    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(200).json({
                error: true,
            });
        }

        console.log(req.body.ProjectToken);

        //* Directory Created Succesfully
        //* deepcode ignore PT: <input sanitized in routes file>
        fs.rename(`../Projects/tmp/${req.file?.originalname}`, `../Projects/${req.body.ProjectToken}/assets/${req.body.TextureName}.jpg`, (err) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                });
            }

            return res.status(200).json({
                error: false,
            });
        });
    });
};

export default {
    UploadTextureFileToServer,
    GetProjectData,
    GetProjectProprieties,
    AddProject,
};
