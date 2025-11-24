import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';

// Retorna os pacientes vinculados a um familiar (usuario_id)
export const getPacientesPorFamiliar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.params.usuarioId || req.query.usuario_id;
    if (!usuarioId) return res.status(400).json({ error: 'usuarioId é obrigatório' });

    // Busca entradas na tabela familia_paciente
    const { data: links, error: linksErr } = await supabase
      .from('familia_paciente')
      .select('paciente_id')
      .eq('usuario_id', usuarioId);

    if (linksErr) {
      console.error('[getPacientesPorFamiliar] erro links:', linksErr);
      return res.status(500).json({ error: 'Erro ao buscar vínculos' });
    }

    const pacienteIds = (links || []).map((l: any) => l.paciente_id).filter(Boolean);

    if (pacienteIds.length === 0) return res.status(200).json([]);

    const { data: pacientes, error: pacientesErr } = await supabase
      .from('pacientes')
      .select('*')
      .in('id', pacienteIds);

    if (pacientesErr) {
      console.error('[getPacientesPorFamiliar] erro pacientes:', pacientesErr);
      return res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }

    return res.status(200).json(pacientes || []);
  } catch (err: any) {
    console.error('[getPacientesPorFamiliar] erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export default { getPacientesPorFamiliar };
