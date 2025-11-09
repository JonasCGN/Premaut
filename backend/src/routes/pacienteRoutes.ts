import { Router } from "express";
import {
  getPacientes,
  getPacientePorId,
  postPaciente,
  deletePaciente,
} from "../controllers/pacienteController";

const router = Router();

router.get("/pacientes", getPacientes);
router.get("/pacientes/:id", getPacientePorId);
router.post("/pacientes", postPaciente);
router.delete("/pacientes/:id", deletePaciente);

export default router;
