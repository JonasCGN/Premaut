import ConfigApp from "../components/config/config";

const API_URL = `${ConfigApp.URL_API}/api/usuarios`;

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: string;
}

export interface ListarUsuariosParams {
  tipo: string;
}

export interface BuscarUsuariosParams {
  nome?: string;
  tipo?: string;
}

// Listar usuários por tipo
export async function listarUsuarios(params: ListarUsuariosParams): Promise<Usuario[]> {
  const queryParams = new URLSearchParams();
  queryParams.append('tipo', params.tipo);

  const res = await fetch(`${API_URL}/listar?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return res.json();
}

// Buscar usuários por nome e/ou tipo
export async function buscarUsuarios(params: BuscarUsuariosParams): Promise<Usuario[]> {
  const queryParams = new URLSearchParams();
  
  if (params.nome) {
    queryParams.append('nome', params.nome);
  }
  
  if (params.tipo) {
    queryParams.append('tipo', params.tipo);
  }

  const res = await fetch(`${API_URL}/buscar?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return res.json();
}