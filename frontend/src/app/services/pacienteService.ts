import ConfigApp from "../components/config/config";

const API_URL = ConfigApp.URL_API;

export interface PacienteEdit {
  nome: string;
  genero: string;
  nascimento: string;
  nascimentoISO?: string;
  telefone: string;
  email: string;
  nivel_suporte: string;
  comodidade: string;
  remedios: string;
  estereotipia: string;
  reforco_positivo: string;
  reforco_negativo: string;
}

// Buscar paciente por ID
export async function buscarPacientePorId(id: string) {
  const res = await fetch(`${API_URL}/api/pacientes/${id}`);
  if (!res.ok) throw new Error('Erro ao buscar paciente');
  return res.json();
}

// Buscar todos os pacientes
export async function buscarPacientes() {
  const res = await fetch(`${API_URL}/api/pacientes`);
  if (!res.ok) throw new Error('Erro ao buscar pacientes');
  return res.json();
}

// Buscar pacientes vinculados a um familiar (usuario_id)
export async function buscarPacientesPorFamiliar(usuarioId: string) {
  const res = await fetch(`${API_URL}/api/familia/${usuarioId}/pacientes`);
  if (!res.ok) throw new Error('Erro ao buscar pacientes vinculados');
  return res.json();
}

// Buscar dados para edição
export async function buscarPacienteParaEdicao(id: string) {
  const res = await fetch(`${API_URL}/api/pacientes/editar/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erro ao carregar dados");
  return res.json();
}

// Atualizar paciente
export async function atualizarPaciente(id: string, data: PacienteEdit) {
  const res = await fetch(`${API_URL}/api/pacientes/editar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.details || errData.error || "Erro ao atualizar");
  }

  return res.json();
}

// Buscar relatórios do paciente
export async function buscarRelatoriosPaciente(id: string) {
  const res = await fetch(`${API_URL}/api/relatorios/paciente/${id}`);
  if (!res.ok) throw new Error('Erro ao buscar relatórios');
  return res.json();
}
