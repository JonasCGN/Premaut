import { Router } from "express";
import eventoRoutes from "./eventoRoutes";
import pacienteRoutes from "./pacienteRoutes";

const router = Router();

router.use(eventoRoutes);
router.use(pacienteRoutes);

export default router;
