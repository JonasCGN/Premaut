import ConfigApp from "../components/config/config";

const API_URL = ConfigApp.URL_API;

export interface Monitor {
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

export interface VincularPacienteData {
  monitorId: string;
  pacienteId: string;
}

// Buscar perfil do monitor
export async function buscarPerfilMonitor(id: string) {
  const res = await fetch(`${API_URL}/api/monitor/perfil/${id}`, {
    headers: {
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error('Erro ao buscar perfil do monitor');
  return res.json();
}

// Buscar monitor para edição
export async function buscarMonitorParaEdicao(id: string) {
  const res = await fetch(`${API_URL}/api/monitor/editar/${id}`, {
    headers: {
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error('Erro ao buscar dados do monitor');
  return res.json();
}

// Atualizar monitor
export async function atualizarMonitor(id: string, data: Monitor) {
  const res = await fetch(`${API_URL}/api/monitor/editar/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.details || errData.error || "Erro ao atualizar monitor");
  }

  return res.json();
}

// Buscar pacientes do monitor
export async function buscarPacientesMonitor(monitorId: string) {
  const res = await fetch(`${API_URL}/api/monitor/pacientes/${monitorId}`);
  if (!res.ok) throw new Error('Erro ao buscar pacientes');
  return res.json();
}

// Buscar pacientes disponíveis
export async function buscarPacientesDisponiveis(userId: string) {
  const res = await fetch(`${API_URL}/api/monitor/pacientes/disponiveis/${userId}`);
  if (!res.ok) throw new Error('Erro ao buscar pacientes disponíveis');
  return res.json();
}

// Vincular paciente
export async function vincularPaciente(data: VincularPacienteData) {
  const res = await fetch(`${API_URL}/api/monitor/pacientes/vincular`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Erro ao vincular paciente");
  }

  return res.json();
}
