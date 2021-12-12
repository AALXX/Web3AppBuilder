
import { Request, Response, NextFunction } from 'express';
import logging from "../../config/logging";
import { Connect, Query } from "../../config/mysql";
import { CreatePublicToken } from "../../UtilityFunctions/TokenCreator"

const NAMESPACE = 'MachinesManager';

const GetFullMachineData = (req: Request, res: Response, next: NextFunction) => {
  const GetMachineDataQueryString = `SELECT * FROM allmachines WHERE machineToken="${req.params.MachineToken}"`

  Connect()
    .then(connection => {

      Query(connection, GetMachineDataQueryString).then(results => {

        let data = JSON.parse(JSON.stringify(results));

        if (Object.keys(data).length === 0) {
          return res.status(200).json({
            error: false,
            MachineExists: false
          });
        }

        return res.status(200).json({
          error: false,
          MachineExists: true,
          MachineName: data[0].MachineName,
          MachineIp: data[0].MachineIp,
        });

      }).catch(error => {
        logging.error(NAMESPACE, error.message, error);
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      }).finally(() => {
        connection.end();
      });

    }).catch(error => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    });

};

const GetBasicMachineData = (req: Request, res: Response, next: NextFunction) => {
  const GetMachineDataQueryString = `SELECT MachineName, MachineToken FROM machines`

  Connect()
    .then(connection => {

      Query(connection, GetMachineDataQueryString).then(results => {

        let data = JSON.parse(JSON.stringify(results));
        return res.status(200).json({
          error: false,
          machines: data
        })

      }).catch(error => {
        logging.error(NAMESPACE, error.message, error);
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      }).finally(() => {
        connection.end();
      });

    }).catch(error => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    });

};

const AddMachine = (req: Request, res: Response, next: NextFunction) => {
  let MachineToken = CreatePublicToken();

  const GetMachineDataQueryString = `INSERT INTO machines (MachineName, MachineToken, MachineOs, MachineIp) VALUES ("${req.body.MachineName}","${MachineToken}","${req.body.MachineOs}","${req.body.MachineIp}")`;

  Connect()
    .then(connection => {

      Query(connection, GetMachineDataQueryString).then(results => {

        let data = JSON.parse(JSON.stringify(results));

        if (data.affectedRows === 0) {
          return res.status(200).json({
            error: true,
          })
        }

        return res.status(200).json({
          error: false,
        })

      }).catch(error => {
        logging.error(NAMESPACE, error.message, error);
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      }).finally(() => {
        connection.end();
      });

    }).catch(error => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    });

};

export default {
  GetFullMachineData,
  GetBasicMachineData,
  AddMachine
};