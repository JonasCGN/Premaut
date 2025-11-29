import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';

export const getPacientes = async (req: Request, res: Response) => {
  try {
    const { nome } = req.query;

    let query = supabase.from('pacientes').select('*');

    if (nome && String(nome).trim()) {
      query = query.ilike('nome', `%${String(nome)}%`);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  } catch (err: any) {
    console.error('[getPacientes] erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export const getPacienteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Validação simples de UUID para evitar erro 500 no banco se passar lixo
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
  }

  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Paciente não encontrado' });
  return res.json(data);
};

export const createPaciente = async (req: Request, res: Response) => {
  const { 
    nome, genero, nivel_suporte, nascimento, comodidade, 
    telefone, email, remedios, estereotipia, reforco_positivo, reforco_negativo 
  } = req.body;

  const { data, error } = await supabase
    .from('pacientes')
    .insert([{ 
        nome, genero, nivel_suporte, nascimento, comodidade, 
        telefone, email, remedios, estereotipia, reforco_positivo, reforco_negativo 
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data[0]);
};

export const updatePaciente = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('pacientes')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Paciente não encontrado' });
  return res.status(200).json(data[0]);
};

export const removePaciente = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Primeiro busca o paciente para retornar os dados
  const { data: paciente, error: buscarError } = await supabase
    .from('pacientes')
    .select('id, nome')
    .eq('id', id)
    .maybeSingle();

  if (buscarError) {
    console.error('[removePaciente] Erro ao buscar:', buscarError);
    return res.status(500).json({ error: buscarError.message });
  }

  if (!paciente) {
    return res.status(404).json({ error: 'Paciente não encontrado' });
  }

  try {
    // Primeiro exclui todos os relatórios do paciente
    const { error: relatoriosError } = await supabase
      .from('relatorios')
      .delete()
      .eq('paciente_id', id);

    if (relatoriosError) {
      console.error('[removePaciente] Erro ao excluir relatórios:', relatoriosError);
      return res.status(500).json({ error: 'Erro ao excluir relatórios do paciente' });
    }

    // Agora remove o paciente
    const { error: pacienteError, count } = await supabase
      .from('pacientes')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (pacienteError) {
      console.error('[removePaciente] Erro na exclusão do paciente:', pacienteError);
      return res.status(500).json({ error: pacienteError.message });
    }

    if (count === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    return res.status(200).json({ 
      message: 'Paciente e seus relatórios excluídos com sucesso',
      paciente: {
        id: paciente.id,
        nome: paciente.nome
      }
    });

  } catch (error: any) {
    console.error('[removePaciente] Erro inesperado:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// Função para excluir paciente (Professor)
export async function excluirPaciente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do paciente é obrigatório." });
    }

    // Verifica se o paciente existe antes de excluir
    const { data: paciente, error: buscarError } = await supabase
      .from("pacientes")
      .select("id, nome")
      .eq("id", id)
      .maybeSingle();

    if (buscarError) {
      console.error("Erro ao buscar paciente:", buscarError);
      return res.status(500).json({ error: "Erro ao buscar paciente." });
    }

    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }

    // Excluir dependências em ordem
    try {
      // 1. Excluir relações monitor-pacientes
      await supabase.from("Monitor_Pacientes").delete().eq("paciente_id", id);
      
      // 2. Excluir relações família-paciente
      await supabase.from("familia_paciente").delete().eq("paciente_id", id);
      
      // 3. Excluir todos os relatórios associados ao paciente
      const { error: excluirRelatoriosError } = await supabase
        .from("relatorios")
        .delete()
        .eq("paciente_id", id);

      if (excluirRelatoriosError) {
        console.error("Erro ao excluir relatórios do paciente:", excluirRelatoriosError);
        return res.status(500).json({ error: "Erro ao excluir relatórios do paciente." });
      }

      // 4. Finalmente, exclui o paciente
      const { error: excluirError } = await supabase
        .from("pacientes")
        .delete()
        .eq("id", id);

      if (excluirError) {
        console.error("Erro ao excluir paciente:", excluirError);
        return res.status(500).json({ error: "Erro ao excluir paciente." });
      }

      return res.status(200).json({ 
        message: "Paciente e todas as suas dependências excluídos com sucesso.",
        paciente: {
          id: paciente.id,
          nome: paciente.nome
        }
      });
    } catch (deleteError) {
      console.error("Erro durante a exclusão:", deleteError);
      return res.status(500).json({ error: "Erro ao excluir dependências do paciente." });
    }
  } catch (error) {
    console.error("Erro inesperado ao excluir paciente:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}