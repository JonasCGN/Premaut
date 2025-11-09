import { Router } from 'express';
import eventoRoutes from './eventoRoutes';
import pacienteRoutes from './pacienteRoutes';

const router = Router();

router.use('/eventos', eventoRoutes);
router.use('/pacientes', pacienteRoutes);

export default router;
