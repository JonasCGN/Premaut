import express, { Request, Response } from "express";
import {
  cadastrarUsuario,
  loginUsuario,
  enviarCodigoRecuperacao,
  redefinirSenha,
  verificarCodigo,
  listarUsuarios,
  buscarUsuarios,
} from "../controllers/usuariosController";

const router = express.Router();

/**
 * @route POST /api/usuarios/cadastro
 * @desc Cadastrar novo usuário
 * @access Público
 */
router.post("/cadastro", cadastrarUsuario);

/**
 * @route POST /api/usuarios/login
 * @desc Login de usuário
 * @access Público
 */
router.post("/login", loginUsuario);

/**
 * @route GET /api/usuarios/listar
 * @desc Listar usuários por tipo
 * @access Privado (Admin)
 */
router.get("/listar", listarUsuarios);

/**
 * @route GET /api/usuarios/buscar
 * @desc Buscar usuários por nome e/ou tipo
 * @access Privado (Admin)
 */
router.get("/buscar", buscarUsuarios);

/**
 * @route POST /api/usuarios/esqueci-senha
 * @desc Envia código de recuperação de senha para o e-mail
 * @access Público
 */
router.post("/esqueci-senha", enviarCodigoRecuperacao);


/**
 * @route POST /api/usuarios/redefinir-senha
 * @desc Redefinir senha do usuário com código recebido
 * @access Público
 */
router.post("/redefinir-senha", redefinirSenha);

router.post("/verificar-codigo", verificarCodigo);
/**
 * @route GET /api/usuarios/teste
 * @desc Verificar se a rota está ativa
 */
router.get("/teste", (req: Request, res: Response) => {
  res.json({ mensagem: "Rota de usuários ativa! 🚀" });
});

export default router;