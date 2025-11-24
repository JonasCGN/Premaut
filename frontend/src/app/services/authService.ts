import ConfigApp from "../components/config/config";
import { setAuthUserId, getAuthHeaders, UserData } from "../utils/auth";

const API_URL = `${ConfigApp.URL_API}/api/usuarios`;

export interface LoginData {
  email: string;
  senha: string;
}

export interface CadastroData {
  nome: string;
  genero?: string;
  telefone?: string;
  email: string;
  senha: string;
  nascimento?: string;
}

export interface EsqueciSenhaData {
  email: string;
}

export interface VerificarCodigoData {
  email: string;
  codigo: string;
}

export interface RedefinirSenhaData {
  email: string;
  codigo: string;
  novaSenha: string;
}

export interface AuthResponse {
  message: string;
  usuario: UserData;
}

// Login
export async function login(data: LoginData): Promise<AuthResponse> {
  const resposta = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await resposta.json();

  if (!resposta.ok) {
    throw new Error(result.error || "Erro ao fazer login.");
  }

  // Salvar userId e dados do usuário nos cookies
  if (result.usuario) {
    setAuthUserId(result.usuario.id, result.usuario);
    
    // Remove dados antigos do localStorage se existirem
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return result;
}

// Cadastro
export async function cadastro(data: CadastroData): Promise<AuthResponse> {
  const resposta = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let result;
  try {
    result = await resposta.json();
  } catch (err) {
    throw new Error("Resposta do servidor não é JSON");
  }

  if (!resposta.ok) {
    throw new Error(result.error || result.mensagem || "Erro ao cadastrar usuário.");
  }

  // Salvar userId e dados do usuário nos cookies
  if (result.usuario) {
    setAuthUserId(result.usuario.id, result.usuario);
    
    // Remove dados antigos do localStorage se existirem
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return result;
}

// Esqueci a senha
export async function esqueciSenha(data: EsqueciSenhaData) {
  const resposta = await fetch(`${API_URL}/esqueci-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await resposta.json();

  if (!resposta.ok) {
    throw new Error(result.error || "Erro ao enviar código.");
  }

  return result;
}

// Verificar código
export async function verificarCodigo(data: VerificarCodigoData) {
  const response = await fetch(`${API_URL}/verificar-codigo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Código incorreto. Tente novamente.");
  }

  return result;
}

// Redefinir senha
export async function redefinirSenha(data: RedefinirSenhaData) {
  const resposta = await fetch(`${API_URL}/redefinir-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await resposta.json();

  if (!resposta.ok) {
    throw new Error(result.error || "Erro ao redefinir senha.");
  }

  return result;
}
