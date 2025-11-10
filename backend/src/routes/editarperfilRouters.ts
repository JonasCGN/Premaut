import express from "express";
import { db, supabase } from "../lib/supabaseClient";
import { usuarioController } from "../controllers/usuarioController";

const router = express.Router();
const controller = usuarioController(supabase);
// rota GET /api/usuarios/me
router.get("/me", controller.buscarPerfil);

// rota PUT /api/usuarios/me
router.put("/me", controller.atualizarPerfil);

export default router;
