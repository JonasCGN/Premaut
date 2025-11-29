import ConfigApp from "../components/config/config";

const API_URL = `${ConfigApp.URL_API}/api/usuarios`;
const PACIENTES_API_URL = `${ConfigApp.URL_API}/api/pacientes`;

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
  // Se o tipo for 'comum' (pacientes), chamar a rota de pacientes
  if (params.tipo && params.tipo.toLowerCase() === 'comum') {
    const res = await fetch(`${PACIENTES_API_URL}`);
    if (!res.ok) throw new Error('Erro ao buscar pacientes');
    const data = await res.json();
    // Normaliza para a interface Usuario esperada pelo frontend
    return (data || []).map((p: any) => ({
      id: p.id,
      nome: p.nome,
      email: p.email || '',
      tipo_usuario: 'comum'
    }));
  }

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
  // Se estiver buscando por pacientes (comum), usar endpoint de pacientes
  if (params.tipo && params.tipo.toLowerCase() === 'comum') {
    const url = params.nome ? `${PACIENTES_API_URL}?nome=${encodeURIComponent(String(params.nome))}` : PACIENTES_API_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar pacientes');
    const data = await res.json();
    return (data || []).map((p: any) => ({
      id: p.id,
      nome: p.nome,
      email: p.email || '',
      tipo_usuario: 'comum'
    }));
  }

  const res = await fetch(`${API_URL}/buscar?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return res.json();
}

// Excluir usuário por ID
export async function excluirUsuario(id: string): Promise<{ message: string; usuario: Usuario }> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = 'Erro ao excluir usuário';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(`${errorMessage} (Status: ${res.status})`);
  }
  
  return res.json();
}

// Excluir paciente por ID (para professores)
export async function excluirPaciente(id: string): Promise<{ message: string }> {
  const res = await fetch(`${PACIENTES_API_URL}/excluir/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = 'Erro ao excluir paciente';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(`${errorMessage} (Status: ${res.status})`);
  }
  
  return res.json();
}