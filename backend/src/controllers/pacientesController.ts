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

  const { error, count } = await supabase
    .from('pacientes')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Paciente não encontrado' });
  return res.status(204).send();
};