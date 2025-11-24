import ConfigApp from "../components/config/config";

const API_URL = ConfigApp.URL_API;

export interface Professor {
  id?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  genero?: string;
  nascimento?: string;
  especializacao?: string;
  registro_profissional?: string;
  tempo_experiencia?: string;
  bio?: string;
}

export interface VincularMonitorData {
  professorId: string;
  monitorId: string;
}

// Buscar professor por ID
export async function buscarProfessorPorId(id: string) {
  const res = await fetch(`${API_URL}/api/professor/${id}`);
  if (!res.ok) throw new Error('Erro ao buscar professor');
  return res.json();
}

// Buscar professor para edição
export async function buscarProfessorParaEdicao(id: string) {
  const res = await fetch(`${API_URL}/api/professor/${id}`, {
    headers: {
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error('Erro ao buscar dados do professor');
  return res.json();
}

// Atualizar professor
export async function atualizarProfessor(id: string, data: Professor) {
  const res = await fetch(`${API_URL}/api/professor/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.details || errData.error || "Erro ao atualizar professor");
  }

  return res.json();
}

// Buscar monitores do professor
export async function buscarMonitoresProfessor(professorId: string) {
  const res = await fetch(`${API_URL}/api/professor-monitores/${professorId}`);
  if (!res.ok) throw new Error('Erro ao buscar monitores');
  return res.json();
}

// Buscar materiais do professor
export async function buscarMateriaisProfessor(professorId: string) {
  const res = await fetch(`${API_URL}/api/materiais?professorId=${professorId}`);
  if (!res.ok) throw new Error('Erro ao buscar materiais');
  return res.json();
}

// Buscar eventos do professor
export async function buscarEventosProfessor(professorId: string) {
  const res = await fetch(`${API_URL}/api/eventos?criador=${professorId}`);
  if (!res.ok) throw new Error('Erro ao buscar eventos');
  return res.json();
}

// Buscar monitores disponíveis
export async function buscarMonitoresDisponiveis(usuarioId: string) {
  const res = await fetch(`${API_URL}/api/professor-monitores/disponiveis/${usuarioId}`);
  if (!res.ok) throw new Error('Erro ao buscar monitores disponíveis');
  return res.json();
}

// Vincular monitor
export async function vincularMonitor(data: VincularMonitorData) {
  const res = await fetch(`${API_URL}/api/professor-monitores/vincular`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Erro ao vincular monitor");
  }

  return res.json();
}

// Remover evento
export async function removerEvento(eventoId: string) {
  const res = await fetch(`${API_URL}/api/eventos/${eventoId}`, { 
    method: "DELETE" 
  });
  
  if (!res.ok) {
    throw new Error("Erro ao remover evento");
  }

  return res.json();
}
