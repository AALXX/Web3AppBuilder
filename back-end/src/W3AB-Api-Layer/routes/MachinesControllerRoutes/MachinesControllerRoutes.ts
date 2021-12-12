import express from "express";

import MachinesManager from "../../Services/MachinesManager/MachinesManager"

const router = express.Router();

router.post("/add-machine/", MachinesManager.AddMachine);
router.get("/get-machines/", MachinesManager.GetBasicMachineData);


export = router;