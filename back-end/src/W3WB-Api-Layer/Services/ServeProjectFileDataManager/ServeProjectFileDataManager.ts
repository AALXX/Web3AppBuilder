import { Request, Response } from 'express';
import fs from 'fs';
import logging from '../../config/logging';
import { connect, query } from '../../config/mysql';
import { validationResult } from 'express-validator';
import { CreatePublicToken } from '../../UtilityFunctions/TokenCreator';

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
    const ProjectToken = CreatePublicToken();

    const AddProjectQueryString = `INSERT INTO projects (ProjectName, ProjectToken) VALUES ("${req.body.ProjectName}", "${ProjectToken}");`;
    connect()
        .then((connection) => {
            //* deepcode ignore Sqli: <input sanitized in routes file>
            query(connection, AddProjectQueryString)
                .then((results) => {
                    const data = JSON.parse(JSON.stringify(results));

                    //* it checks if data object has values if not it sends back account ecist false
                    if (data.affectedRows === 0) {
                        return res.status(200).json({
                            error: true,
                            message: 'no rows affected',
                        });
                    }

                    fs.mkdir(`../Projects/${ProjectToken}/`, (err) => {
                        if (err) {
                            return res.status(200).json({
                                error: true,
                                message: err.message,
                            });
                        }

                        fs.writeFile(`../Projects/${ProjectToken}/${req.body.ProjectName}.json`, `{ "name": "${req.body.ProjectName}", "id": 0, "objects": [] }`, 'utf-8', (err) => {
                            if (err) {
                                return res.status(200).json({
                                    error: true,
                                    message: err.message,
                                });
                            }
                        });
                    });

                    return res.status(200).json({
                        error: false,
                    });
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

const ServeJsonProject = (req: Request, res: Response) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const GetProjectQueryString = `SELECT ProjectName FROM projects WHERE ProjectToken="${req.params.projectToken}";`;
    connect()
        .then((connection) => {
            //* deepcode ignore Sqli: <input sanitized in routes file>
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
                    fs.stat(`Projects/${req.params.projectToken}/${data[0].ProjectName}.json`, (err) => {
                        if (err === null) {
                            //* file exits
                            //* deepcode ignore PT: <input sanitized in routes file>
                            fs.readFile(`Projects/${req.params.projectToken}/${data[0].ProjectName}.json`, 'utf8', (err, Filedata) => {
                                if (err) {
                                    return res.status(200).json({
                                        error: true,
                                        message: err,
                                    });
                                }
                                return res.json(Filedata);
                            });
                        } else if (err.code === 'ENOENT') {
                            //* file does not exits
                            return res.status(200).json({
                                error: true,
                                message: 'file does not exist',
                            });
                        }
                    });
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

export default {
    ServeJsonProject,
    AddProject,
};
