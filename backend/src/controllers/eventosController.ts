import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';

// Listar todos os eventos
export const getEventos = async (req: Request, res: Response) => {
  try {
    const { criador } = req.query;

    let query = supabase.from('eventos').select('*');

    if (criador) {
      // Se tiver criador (professorId), busca primeiro na tabela de relacionamento
      const { data: links, error: linkError } = await supabase
        .from('Professor_Eventos')
        .select('evento_id')
        .eq('professor_id', criador);

      if (linkError) {
        throw linkError;
      }

      const eventoIds = links.map((link: any) => link.evento_id);

      // Filtra os eventos pelos IDs encontrados
      if (eventoIds.length > 0) {
        query = query.in('id', eventoIds);
      } else {
        // Se não tiver eventos vinculados, retorna lista vazia
        return res.status(200).json([]);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
};

// Buscar evento por ID (Inteiro)
export const getEventoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error || !data) return res.status(404).json({ error: 'Evento não encontrado' });
  return res.json(data);
};

// Criar novo evento
export const createEvento = async (req: Request, res: Response) => {
  try {
    const { titulo, data, localizacao, descricao, criador } = req.body;

    // Log do corpo recebido para facilitar debugging
    console.info('[createEvento] req.body:', { titulo, data, localizacao, descricao, criador });

    // Validações básicas
    if (!titulo) return res.status(400).json({ error: 'Campo "titulo" é obrigatório' });

    // Normaliza data: aceita string YYYY-MM-DD ou ISO. Exige data não vazia.
    let eventoData: string | null = null;
    if (data && String(data).trim() !== '') {
      // se for string, tenta converter para ISO (supabase aceita strings ISO)
      eventoData = data;
    } else {
      return res.status(400).json({ error: 'Campo "data" é obrigatório' });
    }

    // 1. Cria o evento na tabela eventos
    const { data: evento, error: eventoError } = await supabase
      .from('eventos')
      .insert([
        {
          titulo,
          data: eventoData,
          localizacao,
          descricao,
        },
      ])
      .select()
      .single();

    if (eventoError) {
      console.error('[createEvento] supabase insert error:', eventoError);
      return res.status(500).json({ error: eventoError.message || 'Erro ao inserir evento' });
    }

    // 2. Se tiver criador numérico (professorId), cria o vínculo na tabela Professor_Eventos
    // Só cria vínculo se o criador for um UUID (string) não vazio
    if (criador !== undefined && criador !== null && String(criador).trim() !== '' && evento) {
      const criadorStr = String(criador).trim();
      // checagem simples de UUID (v4-like) — não é absoluta, mas evita números/strings vazias
      const uuidRegex = /^[0-9a-fA-F-]{36}$/;
      if (uuidRegex.test(criadorStr)) {
        const { error: linkError } = await supabase
          .from('Professor_Eventos')
          .insert([
            {
              professor_id: criadorStr,
              evento_id: evento.id,
            },
          ]);

        if (linkError) {
          console.error('[createEvento] Erro ao vincular evento ao professor:', linkError);
          // não falhar a criação do evento por falha no link
        }
      } else {
        console.warn('[createEvento] valor de criador não parece ser UUID, ignorando link:', criadorStr);
      }
    }

    return res.status(201).json(evento);
  } catch (error) {
    console.error('[createEvento] exceção:', error);
    // tenta enviar mensagem detalhada quando disponível
    const msg = (error as any)?.message || 'Erro ao criar evento';
    return res.status(500).json({ error: msg });
  }
};

// Atualizar evento
export const updateEvento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('eventos')
    .update(updates)
    .eq('id', Number(id))
    .select();

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Evento não encontrado' });
  return res.status(200).json(data[0]);
};

// Deletar evento
export const removeEvento = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const eventoId = Number(id);
    if (isNaN(eventoId)) return res.status(400).json({ error: 'ID inválido' });

    // Primeiro remove vínculos na tabela Professor_Eventos para evitar erro de FK
    const { error: linkDelErr } = await supabase
      .from('Professor_Eventos')
      .delete()
      .eq('evento_id', eventoId);

    if (linkDelErr) {
      console.error('[removeEvento] erro ao deletar links Professor_Eventos:', linkDelErr);
      // não falhar imediatamente — tentaremos deletar o evento mesmo assim
    }

    const { error, count } = await supabase
      .from('eventos')
      .delete({ count: 'exact' })
      .eq('id', eventoId);

    if (error) {
      console.error('[removeEvento] erro ao deletar evento:', error);
      return res.status(500).json({ error: error.message || 'Erro ao deletar evento' });
    }

    if (count === 0) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.status(204).send();
  } catch (err: any) {
    console.error('[removeEvento] exceção inesperada:', err);
    return res.status(500).json({ error: err.message || 'Erro interno ao remover evento' });
  }
};