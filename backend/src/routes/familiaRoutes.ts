import { Router } from 'express';
import { getPacientesPorFamiliar } from '../controllers/familiaController';

const router = Router();

// GET /api/familia/:usuarioId/pacientes
router.get('/:usuarioId/pacientes', getPacientesPorFamiliar);

export default router;
